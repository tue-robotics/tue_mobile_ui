import $ from 'jquery';

(function () {

'use strict';

function handleJointState(device,name_arguments,position_arguments) {

  /* parse argument array */
  position_arguments = position_arguments.split(',');
  for (var i=0; i<position_arguments.length; i++) {
    position_arguments[i] = parseFloat(position_arguments[i]);
  }

  /* Joint names */
  name_arguments = name_arguments.split(',');


  console.log('device: ', device);
  console.log('name_arguments: ', name_arguments);
  console.log('position_arguments: ', position_arguments);

  var action = new ROSLIB.ActionClient({
    ros: ros,
    serverName: 'body/joint_trajectory_action',
    actionName: 'control_msgs/FollowJointTrajectoryAction',
    timeout: 10,
  });

  var goal = new ROSLIB.Goal({
    actionClient: action,
    goalMessage: {
      trajectory: {
        joint_names: name_arguments,
        points: [{
          positions: position_arguments
        }]
      }
    }
  });

  goal.send();
}

function handleAmigoGripperCommand(device,argument) {
  var action = new ROSLIB.ActionClient({
    ros: ros,
    serverName: device + '/action',
    actionName: 'tue_manipulation_msgs/GripperCommandAction',
    timeout: 10,
  });


  var goal = new ROSLIB.Goal({
    actionClient: action,
    goalMessage: {
      command: {
        direction : parseInt(argument, 10),
        max_torque : 50
      }
    }
  });

  goal.send();
}

function handleHeadRef(argument) {
  var action = new ROSLIB.ActionClient({
    ros: ros,
    serverName: 'head_ref/action_server',
    actionName: 'head_ref/HeadReferenceAction',
    timeout: 10,
  });

  argument = argument.split(',');
  for (var i=0; i<argument.length; i++) {
    argument[i] = parseFloat(argument[i]);
  }

  var goal = new ROSLIB.Goal({
    actionClient: action,
    goalMessage: {
      goal_type: 1,
      pan: argument[0],
      tilt: argument[1],
    }
  });

  goal.send();
}

function handleSpeech(speech) {
  var topic = new ROSLIB.Topic({
    ros: ros,
    name: 'text_to_speech/input',
    messageType: 'std_msgs/String'
  });

  var message = new ROSLIB.Message({
    data : speech
  });

  topic.publish(message);
}

function handleActionlib(skill_command) {
  var actionlib = new ROSLIB.ActionClient({
    ros : ros,
    serverName: 'execute_command',
    actionName: 'amigo_skill_server/ExecuteAction'
  });

  var goal = new ROSLIB.Goal({
    actionClient : actionlib,
    goalMessage : {
      command : skill_command
    }
  });

  goal.send();
}

$( document ).ready(function() {
  $('#main button').click(function() {

    var data = $(this).attr('data-src');

    if (!data) {
      console.log('no suitable data-src');
      return;
    }

    var req = data.split('|');

    // Remove whitespace due to the returns
    for (var i=0; i<req.length; i++) {
      req[i] = req[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    switch (req[0]) {
      case 'sensor_msgs/JointState':
        handleJointState(req[1],req[2],req[3]);
        break;
      case 'head_ref/HeadReferenceAction':
        handleHeadRef(req[1], req[2]);
        break;
      case 'amigo_msgs/AmigoGripperCommand':
        handleAmigoGripperCommand(req[1],req[2]);
        break;
      case 'Sound':
        handleSpeech(req[1]);
        break;
      case 'SkillCommand':
        handleActionlib(req[1]);
        break;
    }
  });
});

})();
