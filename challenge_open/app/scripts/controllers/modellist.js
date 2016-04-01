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

      $scope.camera_src = null;

      function update() {
        _.delay(function () {
          var resolution = +location.search.substr(1,location.search.length) || 640;
          robot.head.getImage(resolution, function (url) {
            $scope.$apply(function () {
              $scope.camera_src = url;
              update();
            });
          });
        }, 200);
      }

      update();
    });
  });
