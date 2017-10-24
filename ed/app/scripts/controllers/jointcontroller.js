'use strict';
// THIS IS NOT NECESSARY: EVERYTHING WILL BE IN TeleopCtrl
angular.module('EdGuiApp')
  .controller('JointCtrl', function($scope), $timeout, robot) {

    $scope.sendJointCommand = function(cmd) {
      console.log('Joint command:', cmd)
    }

  });

//   function handleJointState(device,name_arguments,position_arguments) {
//
//   /* parse argument array */
//   position_arguments = position_arguments.split(',');
//   for (var i=0; i<position_arguments.length; i++) {
//     position_arguments[i] = parseFloat(position_arguments[i]);
//   }
//
//   /* Joint names */
//   name_arguments = name_arguments.split(',');
//
//
//   console.log('device: ', device);
//   console.log('name_arguments: ', name_arguments);
//   console.log('position_arguments: ', position_arguments);
//
//   var action = new ROSLIB.ActionClient({
//     ros: ros,
//     serverName: 'body/joint_trajectory_action',
//     actionName: 'control_msgs/FollowJointTrajectoryAction',
//     timeout: 10,
//   });
//
//   var goal = new ROSLIB.Goal({
//     actionClient: action,
//     goalMessage: {
//       trajectory: {
//         joint_names: name_arguments,
//         points: [{
//           positions: position_arguments
//         }]
//       }
//     }
//   });
//
//   goal.send();
// }
