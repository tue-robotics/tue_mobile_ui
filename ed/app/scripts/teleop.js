'use strict';

var TELEOP = {};

TELEOP.Teleop = function(options) {
  options = options || {};
  var ros = options.ros;
  var topic = options.topic || 'cmd_vel';

  var cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : topic,
    messageType : 'geometry_msgs/Twist'
  });

  // sets up a key listener on the page used for keyboard teleoperation
  this.sendTwist = function(x, y, theta) {

    // publish the command
    var twist = new ROSLIB.Message({
      angular : {
        x : 0,
        y : 0,
        z : theta
      },
      linear : {
        x : x,
        y : y,
        z : 0
      }
    });
    cmdVel.publish(twist);
  };
};
TELEOP.Teleop.prototype.__proto__ = EventEmitter2.prototype;
