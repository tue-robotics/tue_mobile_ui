'use strict';

/* global _ */

angular.module('EdGuiApp')
  .controller('ModellistCtrl', function ($scope, robot) {
    $scope.models = robot.ed.models;

    var resolution = Number.parseInt(location.search.substr(1,location.search.length)) || 640;
    console.log('setting the resolution to', resolution, 'pixels');

    robot.ed.on('models', function (models) {
      $scope.$apply(function() {
        $scope.models = _.mapValues(models, function (v, k) {
          v.name = _.last(_.words(k, /\w+/g))
            .replace('_', ' ');
          return v;
        });
      });

      $scope.camera_src = null;

      function update(time_diff) {
        /* eslint-disable-next-line no-unused-vars */
        var waiting_time = time_diff;
        if (time_diff < 66) {
          waiting_time = 66;
        } else if (time_diff > 500) {
          waiting_time = 500;
        }

        _.delay(function () {

          // console.time('getImage');
          robot.head.getImage(resolution, function (url, _, time_diff) {
            // console.timeEnd('getImage');
            $scope.$apply(function () {
              if (url) {
                $scope.camera_src = url;
              }

              update(time_diff);
            });
          });
        }, time_diff * 2);
      }

      update(200);
    });
  });
