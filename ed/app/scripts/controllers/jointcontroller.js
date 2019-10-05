'use strict';

angular.module('EdGuiApp')
  .controller('JointCtrl', function($scope, $timeout, robot) {


    $scope.sendJointCommand = function(cmd) {
      console.log('Joint command: ', cmd)
      robot.body.jointNames['leftArm'] = ["arm_lift_joint", "arm_flex_joint", "arm_roll_joint", "wrist_flex_joint", "wrist_roll_joint"]
      robot.body.jointNames['rightArm'] = ["arm_lift_joint", "arm_flex_joint", "arm_roll_joint", "wrist_flex_joint", "wrist_roll_joint"]
      robot.body.sendGoal(cmd)
    }

    $scope.sendGripperCommand = function(cmd) {
      console.log('Gripper command: ', cmd)
      robot.body.sendGripperGoal(cmd)
    }

    $scope.loadConfiguration = function() {
      $scope.joint_names = robot.body.jointNames
      $scope.default_configurations = robot.body.defaultConfigurations
    }

    $scope.joint_names = robot.body.jointNames
    $scope.default_configurations = robot.body.defaultConfigurations

  });
