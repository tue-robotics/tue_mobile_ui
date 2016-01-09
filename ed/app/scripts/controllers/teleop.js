'use strict';

angular.module('EdGuiApp')
  .controller('TeleopCtrl', function($scope, $timeout, robot) {

    // query kinect with 1 sec interval
    function updateImage() {
      $timeout(function () {
        robot.head.getImage(230, function(rgb_image_url, depth_image_url) {
          $scope.kinect_image = rgb_image_url;
          updateImage();
        });
      }, 1000)
    }
    updateImage();

    $scope.teleopBase = function(teleopEvent) {
      robot.base.sendTwist(teleopEvent.py, 0, - teleopEvent.px);
    }

    $scope.teleopHead = function(teleopEvent) {
      if (teleopEvent.px == 0 && teleopEvent.py == 0) {
        robot.head.cancelGoal();
      } else {
        var scale = 1.5;
        robot.head.sendPanTiltGoal( - scale * teleopEvent.px, - scale * teleopEvent.py);
      }
    }

  });
