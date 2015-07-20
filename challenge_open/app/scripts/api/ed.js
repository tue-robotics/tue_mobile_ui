(function () {
'use strict';

/* global EventEmitter2, _ */

var entities_topic_name = 'ed/gui/entities';

var query_meshes_service_name = 'ed/gui/query_meshes';

var snapshot_service_name = 'ed/gui/get_snapshots';

var models_service_name ='ed/gui/get_models';

var fit_model_service_name = 'ed/gui/fit_model';

var make_snapshot_service_name = 'ed/make_snapshot';

function Ed (robot) {
  EventEmitter2.apply(this);

  var ros = robot.ros;

  // World model entities
  this.entities = [];
  this.meshes = {};
  this.entities_topic = ros.Topic({
    name: entities_topic_name,
    messageType: 'ed_gui_server/EntityInfos',
    throttle_rate: 5000,
  });
  // this.entities_topic.subscribe(this.onEntities.bind(this));

  // Query meshes
  this.query_meshes_service = ros.Service({
    name: query_meshes_service_name,
    serviceType: 'ed_gui_server/QueryMeshes',
  });

  // World model snapshots
  this.snapshots = {};
  this.snapshot_revision = 0;
  this.snapshot_service = ros.Service({
    name: snapshot_service_name,
    serviceType: 'ed_sensor_integration/GetSnapshots',
  });

  this.delete_snapshot_queue = [];

  // timer_id to avoid updating while one is in progress
  // during an update, it will be null
  this.snapshots_timer_id = null;
  this.start_update_loop();

  this.make_snapshot_service = ros.Service({
    name: make_snapshot_service_name,
    serviceType: 'ed_sensor_integration/MakeSnapshot',
  });

  // World model database
  this.models = {};
  this.models_service = ros.Service({
    name: models_service_name,
    serviceType: 'ed_sensor_integration/GetModels',
  });
  this.update_models();

  // World model fitting
  this.fit_model_service = ros.Service({
    name: fit_model_service_name,
    serviceType: 'ed_sensor_integration/FitModel',
  });
}

Ed.prototype = Object.create(EventEmitter2.prototype);

/**
 * World model entities
 */

Object.defineProperty(Ed.prototype, 'entities', {
  get: function() {
    return this._entities;
  },
  set: function(entities) {
    this._entities = entities;
    this.emit('entities', entities);
  }
});

Ed.prototype.onEntities = function(msg) {
  console.log(msg);
  this.entities = msg.entities;

  var mesh_queue = [];
  this.entities.forEach(function (entity) {
    if (this.meshes[entity.id] && this.meshes[entity.id].revision === entity.mesh_revision) {
      console.log('correct revision');
    } else {
      mesh_queue.push(entity.id);
    }
  }.bind(this));

  console.log(mesh_queue);
  var request = { entity_ids: mesh_queue};
  this.query_meshes_service.callService(request, function (response) {
    var error_msg = response.error_msg;
    if (error_msg) {
      console.warn('query_meshes_service:', error_msg);
    }

    response.entity_ids.forEach(function (id, i) {
      // TODO: check revisions
      this.meshes[id] = response.meshes[i];
    }.bind(this));
  }.bind(this));
};

/**
 * World model snapshots
 */

Ed.prototype.update_snapshots = function(callback) {
  callback = callback || _.noop;
  var request = {
    revision: this.snapshot_revision,
    delete_ids: this.delete_snapshot_queue,
  };
  if (this.delete_snapshot_queue.length) {
    console.log('deleting snapshots:', this.delete_snapshot_queue);
    this.snapshots = _.omit(this.snapshots, this.delete_snapshot_queue);
    this.delete_snapshot_queue = [];
  }

  this.snapshot_service.callService(request, function (response) {
    if (!response.new_revision && _.size(this.snapshots) || // revision 0 && old snapshots
        response.new_revision < this.snapshot_revision) {
      console.warn('ed restart detected, reloading...');
      this.snapshots = {}; // clear snapshots
      this.update_models(); // reload model db
    }
    this.snapshot_revision = response.new_revision;

    var snapshots = process_snapshots(response);
    _.assign(this.snapshots, snapshots);

    this.emit('snapshots', this.snapshots);

    callback(null, this.snapshots);
  }.bind(this), function (err) {
    console.warn('update_snapshots failed:', err);
    callback(err, null);
  }.bind(this));
};

function process_snapshots (response) {
  var snapshots = {};

  response.image_ids.forEach(function (id, i) {
    var image_binary = response.images[i];

    var encoding = image_binary.encoding;
    image_binary.src = 'data:image/' + encoding + ';base64,' + image_binary.data;
    image_binary.short_id = _.trunc(id, {
      'length': 8,
      'omission': '',
    });

    snapshots[id] = image_binary;
  }.bind(this));

  return snapshots;
}

Ed.prototype.delete_snapshot = function(id) {
  this.delete_snapshot_queue.push(id);
  this.force_update();
};

Ed.prototype.start_update_loop = function () {
  this.snapshots_timer_id = null;
  this.update_snapshots(function update_again(err, snapshots) {
    var delay = err ? 5000 : 1000;
    this.snapshots_timer_id = _.delay(function (callback) {
      this.snapshots_timer_id = null;
      this.update_snapshots(callback);
    }.bind(this), delay, update_again.bind(this));
  }.bind(this));
};

Ed.prototype.force_update = function() {
  if (this.snapshots_timer_id) {
    console.log('force update');
    window.clearTimeout(this.snapshots_timer_id);
    this.snapshots_timer_id = null;
    this.start_update_loop();
  } else {
    // else an update is already in progress
    console.log('update is already in progress');
  }
};

Ed.prototype.make_snapshot = function(callback) {
  this.make_snapshot_service.callService(null, callback);
};

/**
 * World model database
 */

Ed.prototype.update_models = function update_models () {
  var request = {};
  this.models_service.callService(request, function (response) {

    response.model_names.forEach(function (name, i) {
      var image_binary = response.model_images[i];

      var encoding = image_binary.encoding;
      image_binary.src = 'data:image/' + encoding + ';base64,' + image_binary.data;

      this.models[name] = image_binary;
    }.bind(this));

    this.emit('models', this.models);
  }.bind(this), function (msg) {
    console.warn('update_models failed:', msg);
    _.delay(update_models.bind(this), 5000);
  }.bind(this));
};

/**
 * World model fitting
 */
Ed.prototype.fit_model = function(model_name, image_id, click_x, click_y) {
  var request = {
    model_name: model_name,
    image_id: image_id,
    click_x: click_x,
    click_y: click_y,
  };

  this.fit_model_service.callService(request, function (response) {
    this.force_update();

    var error_msg = response.error_msg;
    if (error_msg) {
      console.warn('fit model error:', error_msg);
    }
  }.bind(this));
};

Ed.prototype.undo_fit_model = function(callback) {
  var request = {
    undo_latest_fit: true,
  };

  this.fit_model_service.callService(request, function (response) {
    this.force_update();

    var error_msg = response.error_msg;
    if (error_msg) {
      console.warn('fit model error:', error_msg);
      callback(error_msg);
    } else {
      callback(null);
    }
  }.bind(this), function (err) {
      this.force_update();

      console.warn('fit model error:', err);
      callback(err);
  }.bind(this));
};

// export global
window.Ed = Ed;

})();
