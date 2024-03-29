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
            icon: 'fa-solid fa-question',
            class: levelColorMap[3],
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

        /* eslint-disable-next-line no-unused-vars */
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
              name: "ebuttonToScope",
              color: levelToClass(value ? 1 : 0),
              icon: 'fa-solid fa-ban'
            }
          ]
        }

        function levelToClass(level) {
          return levelColorMap[level] ? 'btn-' + levelColorMap[level] : '';
        }
      }
    };
  });
