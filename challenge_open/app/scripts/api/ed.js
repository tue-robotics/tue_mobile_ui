(function () {
'use strict';

/* global EventEmitter2, _ */

var entities_topic_name = 'ed/gui/entities';

var query_meshes_service_name = 'ed/gui/query_meshes';

var snapshot_service_name = 'ed/gui/get_snapshots';

var models_service_name ='ed/gui/get_models';

var fit_model_service_name = 'ed/gui/fit_model';

var make_snapshot_service_name = 'ed/make_snapshot';

var navigate_to_service_name = 'ed/navigate_to';

var create_walls_service_name = 'ed/create_walls';

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

  this.navigate_to_service = ros.Service({
    name: navigate_to_service_name,
    serviceType: 'ed_sensor_integration/NavigateTo',
  });

  this.create_walls_service = ros.Service({
    name: create_walls_service_name,
    serviceType: 'std_srvs/Empty',
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

Ed.prototype.update_snapshots = function(callback, max_num_revisions) {
  callback = callback || _.noop;
  max_num_revisions = max_num_revisions || 0;

  var request = {
    revision: this.snapshot_revision,
    delete_ids: this.delete_snapshot_queue,
    max_num_revisions: max_num_revisions,
  };
  if (this.delete_snapshot_queue.length) {
    console.log('deleting snapshots:', this.delete_snapshot_queue);
    this.snapshots = _.omit(this.snapshots, this.delete_snapshot_queue);
    this.delete_snapshot_queue = [];
  }

  // console.debug('update %d snapshots', max_num_revisions);
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

    callback(null, snapshots);
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

    var ts = response.image_timestamps[i];
    image_binary.timestamp = new Date(ts.secs + ts.nsecs*1e-9);

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
  this.update_snapshots(function update_again(err, new_snapshots) {
    // console.debug('i got %d new snapshots', _.size(new_snapshots));

    var delay = 1000;
    if (err) {
      delay = 5000;
    } else if (_.size(new_snapshots)) {
      delay = 0;
    }

    this.snapshots_timer_id = _.delay(function (callback) {
      this.snapshots_timer_id = null;
      this.update_snapshots(callback);
    }.bind(this), delay, update_again.bind(this));
  }.bind(this), 1);
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
  this.force_update();
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
Ed.prototype.fit_model = function(model_name, image_id, click_x_ratio, click_y_ratio) {
  var request = {
    model_name: model_name,
    image_id: image_id,
    click_x_ratio: click_x_ratio,
    click_y_ratio: click_y_ratio,
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

var navigate_types = {
  NAVIGATE_TO_PIXEL: 1,
  TURN_LEFT        : 2,
  TURN_RIGHT       : 3,
};

Ed.prototype.navigate_to = function(x, y, snapshot_id) {
  this.navigate_to_service.callService({
    snapshot_id: snapshot_id,
    navigation_type: navigate_types['NAVIGATE_TO_PIXEL'],
    click_x_ratio: x,
    click_y_ratio: y,
  }, function (result) {
    var error_msg = result.error_msg;
    if (error_msg) {
      console.warn(error_msg);
    }
  });
};

Ed.prototype.create_walls = function(callback) {
  callback = callback || _.noop;
  this.create_walls_service.callService({}, function (result) {
    callback();
  });
};

// export global
window.Ed = Ed;

})();
