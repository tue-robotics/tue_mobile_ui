import { map } from 'lodash';

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

        var nameIconMap = {
          'Wired': 'glyphicon glyphicon-ban-circle',
          'Wireless': 'glyphicon glyphicon-signal',
          'Endswitch': 'glyphicon glyphicon-resize-vertical',
          'Reset': 'glyphicon glyphicon-play-circle',
          'default': 'glyphicon glyphicon-question-sign'
        };

        // The state where the buttons will go on start and on timeout
        var DEFAULT_STATE = [
          {
            icon: nameIconMap['default'],
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

        robot.hardware.on('ebuttons', function (ebuttons) {
          setEbuttons(ebuttonsToScope(ebuttons));
        });

        // Functions to convert between messages and models

        function ebuttonsToScope(ebuttons) {
          if (!ebuttons) {
            return DEFAULT_STATE;
          }
          return map(ebuttons, function (status) {
            return {
              name: status.name,
              color: levelToClass(status.level),
              icon: nameToIcon(status.name)
            };
          });
        }

        function levelToClass(level) {
          return levelColorMap[level] ? 'btn-' + levelColorMap[level] : '';
        }

        function nameToIcon(name) {
          return nameIconMap[name] || nameIconMap['default'];
        }
      }
    };
  });
