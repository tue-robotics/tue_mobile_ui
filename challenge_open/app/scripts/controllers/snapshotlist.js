'use strict';

angular.module('challengeOpenApp')
  .controller('SnapshotlistCtrl', function (robot, $scope) {
    $scope.snapshots = robot.ed.snapshots;

    $scope.select = function (id) {
      $scope.selected = id;
    };

    $scope.delete = function (id, $event) {
      robot.ed.delete_snapshot(id);
      $event.stopPropagation();
    };

    $scope.isUndoing = false;
    $scope.undo = function () {
      $scope.isUndoing = true;
      robot.ed.undo_fit_model(function () {
        $scope.$apply(function () {
          $scope.isUndoing = false;
        });
      });
    };

    $scope.isSnapshotting = false;
    $scope.make_snapshot = function () {
      $scope.isSnapshotting = true;
      robot.ed.make_snapshot(function () {
        $scope.$apply(function () {
          $scope.isSnapshotting = false;
        });
      });
    };

    $scope.backgroundSize = "contain";
    $scope.stretch = function () {
      if ($scope.backgroundSize === "contain") {
        $scope.backgroundSize = "71% 100%";
      } else {
        $scope.backgroundSize = "contain";
      }
    };

    robot.ed.on('snapshots', function (snapshots) {
      $scope.$apply(function () {
        $scope.snapshots = snapshots;
      });
    });

    $scope.onDragComplete = function (data, e) {};

    $scope.onDropComplete = function (data, e) {
      var div = e.element.parent()[0];
      var width_pixels, height_pixels;
      if ($scope.backgroundSize === "contain")
      {
        var ratio = 640 / 480;
        // Check height of width contain
        if (div.offsetWidth / div.offsetHeight > ratio) {
          console.log("we scale on height");
          height_pixels = div.offsetHeight;
          width_pixels = ratio * div.offsetHeight;
        }
        else {
          console.log("we scale on width");
          width_pixels = div.offsetWidth;
          height_pixels = div.offsetWidth / ratio;
        }
        console.log("bg WIDTHxHEIGHT: " + width_pixels + "x" + height_pixels);
      }
      else
      {
        height_pixels = div.offsetHeight;
        width_pixels = 0.71 * div.offsetWidth;
      }

      var x = e.x;
      var y = e.y - div.offsetTop;

      var x_ratio = x / width_pixels;
      var y_ratio = y / height_pixels;

      console.log("x_ratio and y_ratio in bg: " + x_ratio + "x" + y_ratio);

      if (x_ratio > 1 || y_ratio > 1)
        return;

      console.log("Fit model!");
      robot.ed.fit_model(data, $scope.selected, x_ratio, y_ratio);
    };
  });
