'use strict';

angular.module('challengeOpenApp')
  .controller('ModellistCtrl', function ($scope, robot) {
    $scope.models = robot.ed.models;

    robot.ed.on('models', function (models) {
      $scope.$apply(function() {
        $scope.models = models;
      });
    })
  });
