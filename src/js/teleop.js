var TELEOP = {};

TELEOP.Teleop = function(options) {
  var that = this;
  options = options || {};
  var ros = options.ros;
  var topic = options.topic || '/cmd_vel';
  // permanent throttle
  var throttle = options.throttle || 1.0;

  // used to externally throttle the speed (e.g., from a slider)
  this.scale = 1.0;

  // linear x and y movement and angular z movement
  var x = 0;
  var y = 0;
  var z = 0;

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

    // check for changes
    //that.emit('change', twist);
  };
};
TELEOP.Teleop.prototype.__proto__ = EventEmitter2.prototype;
