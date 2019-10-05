'use strict';

angular.module('EdGuiApp')

.directive('tueEbuttons', function () {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: '/ebutton.html',

    controller: function ($scope, $attrs, robot) {
      // Constants
      var levelColorMap = {
        0: 'success', // unlocked
        1: 'danger',  // locked
        2: 'warning', // unknown
        3: 'default', // unavailable
      };

      // The state where the buttons will go on start and on timeout
      var DEFAULT_STATE = [
        {
          icon: 'glyphicon glyphicon-question-sign',
          class: levelColorMap[0],
        }
      ];

      $scope.ebuttons = DEFAULT_STATE;

      // only set when the state differs, less dom manipulation
      var oldEbuttons;
      function setEbuttons(ebuttons) {
        if (!angular.equals(oldEbuttons, ebuttons)) {
          oldEbuttons = ebuttons;
          $scope.$apply(function () {
            $scope.ebuttons = ebuttons;
          });
        }
      }

      const runStopTopic = robot.ros.Topic({
        name: 'runstop_button',
        messageType: 'std_msgs/Bool'
      }).subscribe(function (msg) {
        setEbuttons(ebuttonToScope(msg.data));
      })

      // Functions to convert between messages and models

      function ebuttonToScope(value) {
        return [
          {
            name: "Blaat",
            color: levelToClass(value ? 1 : 0),
            icon: 'glyphicon glyphicon-ban-circle'
          }
        ]
      }

      function levelToClass(level) {
        return levelColorMap[level] ? 'btn-' + levelColorMap[level] : '';
      }
    }
  };
});
