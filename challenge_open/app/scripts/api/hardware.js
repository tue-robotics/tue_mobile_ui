(function () {
'use strict';

/* global EventEmitter2, _ */

// Hardware constants

var levels = {
  STALE:        0,
  IDLE:         1,
  OPERATIONAL:  2,
  HOMING:       3,
  ERROR:        4,
};

// Robot specific Hardware constants that should come from the parameter server

/*
|   Name  | Homeable | HomeableMandatory | Resetable |
|---------|----------|-------------------|-----------|
| Base    | no       | no                | yes       |
| Spindle | yes      | yes               | yes       |
| Arm     | yes      | no                | yes       |
| Head    | no       | no                | no        |
*/
var properties = {
  // Name     | Homeable | HomeableMandatory | Resetable |
  all:        [ true     , false             , true      ],
  base:       [ false    , false             , true      ],
  spindle:    [ true     , true              , true      ],
  left_arm:   [ true     , false             , true      ],
  right_arm:  [ true     , false             , true      ],
  head:       [ false    , false             , false     ],
};
// transform the array of bools to an object
properties = _.mapValues(properties, function (v) {
  return {
    homeable:           v[0],
    homeable_mandatory: v[1],
    resetable:          v[2],
  };
});

var hardware_ids = {
  'all':        0,
  'base':       1,
  'spindle':    2,
  'left_arm':   3,
  'right_arm':  4,
  'head':       5,
};

var default_status = _.mapValues(hardware_ids, function (value, name) {
  return {
    name: name,
    level: levels.STALE,
    homed: false,
  };
});

// public API

function Hardware (robot) {
  EventEmitter2.apply(this);

  var ros = robot.ros;

  this.status = [];
  this.status_topic = ros.Topic({
    name: 'hardware_status',
    messageType: 'diagnostic_msgs/DiagnosticArray',
    throttle_rate: 500,
  });
  this.status_topic.subscribe(this.onStatus.bind(this));

  this.models = [];
}

Hardware.prototype = Object.create(EventEmitter2.prototype);

Object.defineProperty(Hardware.prototype, 'status', {
  get: function() {
    return this._status;
  },
  set: function(status) {
    this._status = status;
    this.emit('status', status);
  }
});

Hardware.prototype.onStatus = function(msg) {
  this.status = diagnosticMsgToStatus(msg);
};

// convert an incoming status message to actual workable properties
function diagnosticMsgToStatus(message) {
  var parts = message.status.map(function (part) {
    return {
      name: part.name,
      level: part.level,
      homed: part.message === 'homed',
    };
  });
  var hardware_status = _.indexBy(parts, 'name');

  // fill all missing hardware parts with 'idle'
  _.defaults(hardware_status, default_status);

  _.mapValues(hardware_status, function (part) {
    part.actions = getActions(part);
    return part;
  });

  return hardware_status;
}

// return all possible actions for a hardware part
function getActions(part) {
  var props = properties[part.name];
  if (!props) {
    return;
  }

  var level = part ? part.level : -1;
  var homed = part ? part.homed : false;

  var actions = {};

  // only show the home action if homeable
  if (props.homeable) {
    actions.home = {
      enabled: level === levels.IDLE,
      warning: homed ?
        'This part was already homed, Are you sure you want to redo homing?' : false,
    };
  }

  // always show start action
  actions.start = {
    enabled: level === levels.IDLE && (homed || !props.homeable_mandatory),
    warning: props.homeable && !homed ?
      'This part is not yet homed, Are you sure you want to proceed?' : false,
  };

  // always show stop action
  actions.stop = {
    enabled: level === levels.HOMING || level === levels.OPERATIONAL,
  };

  // only show reset action if resetable
  if (props.resetable) {
    actions.reset = {
      enabled: level === levels.ERROR,
    };
  }

  return actions;
}

window.Hardware = Hardware;

})();
