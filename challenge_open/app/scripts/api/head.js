(function () {
'use strict';

/* global ROSLIB, EventEmitter2 */

function Head (robot) {
  EventEmitter2.apply(this);

  var ros = robot.ros;

  this.goal = null;
  this.head_ac = ros.ActionClient({
    serverName: 'head_ref/action_server',
    actionName: 'head_ref/HeadReferenceAction',
  });
}

Head.prototype = Object.create(EventEmitter2.prototype);

Head.prototype.send_goal = function() {
  this.goal = new ROSLIB.Goal({
    actionClient: this.head_ac,
    goalMessage: {
      goal_type: null,          // either LOOKAT or PAN_TILT

      priority: 1,           // [1-255] (action client calls with the same priority cancel each other)

      pan_vel: null,            // pan_vel
      tilt_vel: null,           // tilt_vel

      // in case of LOOKAT:
      target_point: null,       // use in case of LOOKAT

      // in case of PAN_TILT
      pan: null,                // use in case of PAN_TILT
      tilt: null,               // use in case of PAN_TILT

      end_time: null            // goal cancels automatically after this time (seconds), if 0, no auto cancel
    }
  });

  this.goal.on('feedback', function(feedback) {
    console.log('Feedback:', feedback);
  });
  this.goal.on('result', function(result) {
    console.log('Result:', result);
  });
};


// export global
window.Head = Head;

})();
