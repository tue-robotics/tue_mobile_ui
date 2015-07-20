(function () {
'use strict';

/* global ROSLIB, EventEmitter2 */

function Base (robot) {
  EventEmitter2.apply(this);

  var ros = robot.ros;

  this.cmd_vel_topic = ros.Topic({
    name: 'base/references',
    messageType: 'geometry_msgs/Twist',
  });
}

Base.prototype = Object.create(EventEmitter2.prototype);

Base.prototype.sendTwist = function(vx, vy, vth) {
  // publish the command
  var twist = new ROSLIB.Message({
    angular : {
      x : 0,
      y : 0,
      z : vth
    },
    linear : {
      x : vx,
      y : vy,
      z : 0
    }
  });
  this.cmd_vel_topic.publish(twist);
  // console.log(this.cmd_vel_topic);
  // console.log(twist);
};

// export global
window.Base = Base;

})();
