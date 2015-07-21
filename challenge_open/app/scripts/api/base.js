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

  this.local_planner_topic = ros.Topic({
    name: 'local_planner/action_server/goal',
    messageType: 'cb_planner_msgs_srvs/LocalPlannerActionGoal',
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
  console.log("sendTwist: " + vx + "," + vy + "," + vth);
};

Base.prototype.sendLocalPlannerGoal = function(plan, look_at_x, look_at_y) {
  // std_msgs/Header header
  //   uint32 seq
  //   time stamp
  //   string frame_id
  // actionlib_msgs/GoalID goal_id
  //   time stamp
  //   string id
  // cb_planner_msgs_srvs/LocalPlannerGoal goal
  //   geometry_msgs/PoseStamped[] plan
  //     std_msgs/Header header
  //       uint32 seq
  //       time stamp
  //       string frame_id
  //     geometry_msgs/Pose pose
  //       geometry_msgs/Point position
  //         float64 x
  //         float64 y
  //         float64 z
  //       geometry_msgs/Quaternion orientation
  //         float64 x
  //         float64 y
  //         float64 z
  //         float64 w
  //   cb_planner_msgs_srvs/OrientationConstraint orientation_constraint
  //     string frame
  //     geometry_msgs/Point look_at
  //       float64 x
  //       float64 y
  //       float64 z
  //     float64 angle_offset

  // publish the command
  var goal = new ROSLIB.Message({
    goal : {
      plan : plan,
      orientation_constraint : {
        frame : "/map",
        look_at : {
          x : look_at_x,
          y : look_at_y
        }
      },
    }
  });
  this.local_planner_topic.publish(goal);
  // console.log(this.cmd_vel_topic);
  // console.log(twist);
  console.log("sendGoal to local planner: " + goal);
};

// export global
window.Base = Base;

})();
