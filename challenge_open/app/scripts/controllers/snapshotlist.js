'use strict';

angular.module('challengeOpenApp')
  .controller('SnapshotlistCtrl', function (robot, $scope) {
    $scope.snapshots = robot.ed.snapshots;

    $scope.select = function (id) {
      $scope.selected = id;
    };

    $scope.delete = function (id) {
      robot.ed.delete_snapshot(id);
    };

    robot.ed.on('snapshots', function (snapshots) {
      $scope.$apply(function () {
        $scope.snapshots = snapshots;
      });
    });

    $scope.onDragComplete = function (data, e) {
       console.log('drag success, data:', data, e);
    };
    $scope.onDropComplete = function (data, e) {
      robot.ed.fit_model(data, $scope.selected, e.x, e.y);
    };
  });
