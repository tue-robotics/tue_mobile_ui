(function () {
'use strict';

/* global EventEmitter2, _ */

var entities_topic_name = 'ed/gui/entities';

var snapshot_service_name = 'ed/gui/get_snapshots';

var models_service_name ='ed/gui/get_models';

var fit_model_service_name = 'ed/gui/fit_model';

function Ed (robot) {
  EventEmitter2.apply(this);

  var ros = robot.ros;

  // World model entities
  this.entities = [];
  this.entities_topic = ros.Topic({
    name: entities_topic_name,
    messageType: 'ed_gui_server/EntityInfos',
    throttle_rate: 5000,
  });
  // this.entities_topic.subscribe(this.onEntities.bind(this));

  // World model snapshots
  this.snapshots = {};
  this.snapshot_reision = 0;
  this.snapshot_service = ros.Service({
    name: snapshot_service_name,
    serviceType: 'ed_sensor_integration/GetSnapshots',
  });

  // auto update snapshots
  this.update_snapshots(function update_again() {
    _.delay(this.update_snapshots.bind(this), 1000, update_again.bind(this));
  }.bind(this));

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
};

/**
 * World model snapshots
 */

Ed.prototype.update_snapshots = function(callback) {
  callback = callback || _.noop;
  var request = {
    revision: this.snapshot_revision,
  };

  this.snapshot_service.callService(request, function (response) {
    this.snapshot_revision = response.new_revision;

    response.image_ids.forEach(function (id, i) {
      var image_binary = response.images[i];

      var encoding = image_binary.encoding;
      image_binary.src = 'data:image/' + encoding + ';base64,' + image_binary.data;
      image_binary.short_id = _.trunc(id, {
        'length': 8,
        'omission': '',
      });

      this.snapshots[id] = image_binary;
    }.bind(this));

    this.emit('snapshots', this.snapshots);
    callback(this.snapshots);
  }.bind(this));
};

/**
 * World model database
 */

Ed.prototype.update_models = function() {

  var request = {};
  this.models_service.callService(request, function (response) {

    response.model_names.forEach(function (name, i) {
      var image_binary = response.model_images[i];

      var encoding = image_binary.encoding;
      image_binary.src = 'data:image/' + encoding + ';base64,' + image_binary.data;

      this.models[name] = image_binary;
    }.bind(this));

    this.emit('models', this.models);
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
    var error_msg = response.error_msg;
    if (error_msg) {
      console.warn('fit model error:', error_msg);
    }
  });
};

// export global
window.Ed = Ed;

})();
