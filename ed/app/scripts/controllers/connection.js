'use strict';

angular.module('EdGuiApp')
  .controller('ConnectionCtrl', function ($scope, robot) {

    $scope.connection = robot.status;

    robot.on('status', function (status) {
      $scope.$apply(function () {
        $scope.connection = status;
      });
    });
  });
