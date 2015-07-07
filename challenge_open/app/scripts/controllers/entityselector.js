'use strict';

angular.module('challengeOpenApp')
  .controller('EntityselectorCtrl', function ($scope, robot) {
    $scope.entities = [];

    $scope.entities = robot.ed.get_entities();
  });
