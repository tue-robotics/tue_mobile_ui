import EventEmitter2 from 'eventemitter2';
import {Topic, Message} from 'roslib';

export default function Teleop(options) {
  options = options || {};
  var ros = options.ros;
  var topic = options.topic || 'cmd_vel';

  var cmdVel = new Topic({
    ros : ros,
    name : topic,
    messageType : 'geometry_msgs/Twist'
  });

  // sets up a key listener on the page used for keyboard teleoperation
  this.sendTwist = function(x, y, theta) {

    // publish the command
    var twist = new Message({
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
}
Teleop.prototype.__proto__ = EventEmitter2.prototype;
