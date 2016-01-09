'use strict';

angular.module('EdGuiApp')
  .controller('MainCtrl', function($scope, $interval, robot) {

    $scope.entitySelection = function(entityEvent) {
      $scope.selectedEntityEvent = entityEvent;
      $scope.$digest();
    }

    // query ed with 100 ms interval
    function updateEd() {
      setTimeout(function () {
        robot.ed.query(updateEd);
      }, 100);
    }
    robot.ed.query(updateEd);
  });
