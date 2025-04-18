'use strict';

/* eslint-disable-next-line no-unused-vars */
var app = angular.module('EdGuiApp')
  .directive('tueBatteryStatus', function () {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: '/battery.html',

      controller: function ($scope, robot) {
        $scope.batteries = {}
        /* eslint-disable-next-line no-unused-vars */
        const statusTopic = robot.ros.Topic({
          name: 'battery',
          messageType: 'sensor_msgs/BatteryState'
        }).subscribe(function (msg) {
          var value = parseInt(msg.percentage*100)
          var type = 'info'
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
          var ordered = {};
          Object.keys($scope.batteries).sort().forEach(function(key) {
            ordered[key] = $scope.batteries[key];
          })
          $scope.batteries = ordered
          $scope.$digest()
        })
      },  // End of controller
    };  // End of return
  });  // End of directive
