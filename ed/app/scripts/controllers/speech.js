'use strict';

angular.module('EdGuiApp')
  .controller('SpeechCtrl', function($scope, $timeout, robot) {

    $scope.speak = function() {
      console.log('Speak command: ', $scope.sentence)
      robot.speech.speak({sentence: $scope.sentence})
    }

  });
