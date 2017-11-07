'use strict';
// THIS IS NOT NECESSARY: EVERYTHING WILL BE IN TeleopCtrl
angular.module('EdGuiApp')
  .controller('JointCtrl', function($scope, $timeout, robot) {

    $scope.sendJointCommand = function(cmd) {
      console.log('Joint command: ', cmd)
      robot.body.sendGoal(cmd)
    }

    $scope.sendGripperCommand = function(cmd) {
      console.log('Gripper command: ', cmd)
      robot.body.sendGripperGoal(cmd)
    }

    $scope.joint_names = robot.body.joint_names
    $scope.default_configurations = robot.body.default_configurations

  });
