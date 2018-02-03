'use strict';

angular.module('EdGuiApp')
  .controller('EdCtrl', function($scope, $timeout, robot) {

  	$scope.reset = function() {
      console.log('Reset ED');
      robot.ed.reset(true);
    }

  });
