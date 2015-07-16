'use strict';

angular.module('challengeOpenApp')
  .controller('SnapshotlistCtrl', function (robot, $scope) {
    $scope.snapshots = robot.ed.snapshots;

    $scope.select = function (id) {
      $scope.selected = id;
    };

    robot.ed.on('snapshots', function (snapshots) {
      $scope.$apply(function () {
        $scope.snapshots = snapshots;
      });
    });
  });
