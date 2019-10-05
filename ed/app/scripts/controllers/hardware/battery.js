'use strict';

var app = angular.module('EdGuiApp')
.directive('tueBatteryStatus', function () {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/battery.html',

    controller: function ($scope, robot) {
      $scope.batteries = {}
      const statusTopic = robot.ros.Topic({
        name: 'battery',
        messageType: 'sensor_msgs/BatteryState'
      }).subscribe(function (msg) {
        var value = parseInt(msg.percentage * 100)
        var type = 'secondary'
        if (value > 40) {
          type = 'success';
        } else if (value > 20) {
          type = 'warning';
        } else {
          type = 'danger';
        }
        $scope.batteries[msg.location] = {
          value: value,
          type: type
        }
        $scope.$digest()
      })
    },  // End of controller
  };  // End of return
});  // End of directive