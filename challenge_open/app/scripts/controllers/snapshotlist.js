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
        $scope.isUndoing = false;
      });
    };

    $scope.isSnapshotting = false;
    $scope.make_snapshot = function () {
      $scope.isSnapshotting = true;
      robot.ed.make_snapshot(function () {
        $scope.$apply(function () {
          $scope.isSnapshotting = false;
        });
      })
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
      var div = e.element.parent();
      var w = div[0].offsetWidth;
      var x = 100*e.x/w*1.29 | 0;
      var y = 100*e.y/w*1.29 | 0;

      console.log('drop success, data:', data, x, y);
      robot.ed.fit_model(data, $scope.selected, x, y);
    };
  });
