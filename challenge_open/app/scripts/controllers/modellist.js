'use strict';

/* global _ */

angular.module('challengeOpenApp')
  .controller('ModellistCtrl', function ($scope, robot) {
    $scope.models = robot.ed.models;

    robot.ed.on('models', function (models) {
      $scope.$apply(function() {
        $scope.models = _.mapValues(models, function (v, k) {
          v.name = _.last(_.words(k, /\w+/g))
            .replace('_', ' ');
          return v;
        });
      });
    });
  });
