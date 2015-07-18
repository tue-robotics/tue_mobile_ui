'use strict';

angular.module('challengeOpenApp')
  .controller('ModellistCtrl', function ($scope, robot) {
    // robot.ed.update_models(); //tmp
    $scope.models = robot.ed.models;

    robot.ed.on('models', function (models) {
      $scope.$apply(function() {
        $scope.models = _.mapKeys(r.ed.models, function (v, k) {
          return _.last(k.split('.')).replace('_', ' ')
        });
      });
    });
  });
