'use strict';

/* global _ */

angular.module('EdGuiApp')
  .controller('SnapshotlistCtrl', function (robot, $scope) {

    $scope.isUndoing = false;
    $scope.undo = function () {
      $scope.isUndoing = true;
      robot.ed.undo_fit_model(function () {
        _.delay(function () {
          $scope.$apply(function () {
            $scope.isUndoing = false;
          });
        }, 1000);
      });
    };

    $scope.backgroundSize = '71% 100%';

    $scope.isAskingGPSR = false;
    $scope.gpsr = function () {
      $scope.isAskingGPSR = true;

      _.delay(function () {
        $scope.$apply(function () {
          $scope.isAskingGPSR = false;
        });
      }, 1000);
    };

    $scope.send_twist = function (vx, vy, vth) {
      robot.base.sendTwist(vx, vy, vth);
    };

    $scope.camera_click = function (e) {
      var x = e.offsetX;
      var y = e.offsetY;

      var div = e.target;
      var size = getViewSize(div);

      var width_pixels = size.width;
      var height_pixels = size.height;

      var x = e.x;
      var y = e.y - div.offsetTop;

      var x_ratio = x / width_pixels;
      var y_ratio = y / height_pixels;

      console.log('x_ratio and y_ratio in bg: ' +
        (x_ratio*100).toFixed(1) + '% x ' +
        (y_ratio*100).toFixed(1) + '%' );
      robot.ed.fit_model('NAVIGATE', x_ratio, y_ratio);
    };

    robot.head.on('update_time', function (t) {
      $scope.$apply(function () {
        $scope.update_time = t;
      });
    });

    $scope.onDragComplete = function (data, e) {};

    $scope.onDropComplete = function (data, e) {
      var div = e.element.parent()[0].parentElement;
      var size = getViewSize(div);

      var width_pixels = size.width;
      var height_pixels = size.height;

      var x = e.x;
      var y = e.y - div.offsetTop;

      var x_ratio = x / width_pixels;
      var y_ratio = y / height_pixels;

      console.log('x_ratio and y_ratio in bg: ' +
        (x_ratio*100).toFixed(1) + '% x ' +
        (y_ratio*100).toFixed(1) + '%' );

      if (x_ratio > 1 || y_ratio > 1) {
        console.log('skipping click');
        return;
      }

      console.log('Fit model!', data, x_ratio, y_ratio);
      robot.ed.fit_model(data, x_ratio, y_ratio);
    };

    function getViewSize (div) {
      var width_pixels, height_pixels;
      if ($scope.backgroundSize === 'contain')
      {
        var ratio = 640 / 480;
        // Check height of width contain
        if (div.offsetWidth / div.offsetHeight > ratio) {
          // console.log('we scale on height');
          height_pixels = div.offsetHeight;
          width_pixels = ratio * div.offsetHeight;
        }
        else {
          // console.log('we scale on width');
          width_pixels = div.offsetWidth;
          height_pixels = div.offsetWidth / ratio;
        }
        // console.log('bg WIDTHxHEIGHT: ' + width_pixels + 'x' + height_pixels);
      }
      else
      {
        height_pixels = div.offsetHeight;
        width_pixels = 0.71 * div.offsetWidth;
      }

      return {
        height: height_pixels,
        width: width_pixels,
      };
    }
  });
