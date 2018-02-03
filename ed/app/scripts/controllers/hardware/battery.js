angular.module('EdGuiApp')
  .directive('tueBatteryStatus', function () {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: '/battery.html',

      controller: function ($scope, robot) {

        function setBattery(percent) {
          if (angular.isNumber(percent)) {
            $scope.battery = percent;
            $scope.batteryUnknown = false;
          } else {
            $scope.battery = 100;
            $scope.batteryUnknown = true;
          }
        }

        setBattery(robot.hardware.battery);
        robot.hardware.on('battery', function (percent) {
          $scope.$apply(function () {
            setBattery(percent);
          });
        });

        // change battery type based on value
        $scope.$watch('battery', function(value){
          var type;
          if ($scope.batteryUnknown) {
            type = 'info';
          } else if (value > 40) {
            type = 'success';
          } else if (value > 20) {
            type = 'warning';
          } else {
            type = 'danger';
          }
          $scope.batteryType = type;
        });
      },  // End of controller
    };  // End of return
  });  // End of directive