'use strict';

angular.module('EdGuiApp')

  .directive('tueHardwareButton', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: '/hardware-button.html',
      scope: {
        status: '=',
        sendAction: '&action',
      },
      controller: function ($scope) {
        $scope.handleClick = function (action) {
        // check if this action was enabled
          var options = $scope.status.actions[action];
          if (!options.enabled) {
            return;
          }

          // confirm any warnings
          var warning = options.warning;
          if (warning && !window.confirm(warning)) {
            return;
          }

          // send it to the parent scope
          $scope.sendAction({action:action});
        };
      }
    };
  });
