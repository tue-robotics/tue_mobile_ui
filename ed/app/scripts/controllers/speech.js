'use strict';

angular.module('EdGuiApp')
  .controller('SpeechCtrl', function($scope, $timeout, robot) {

    $scope.speech_history = []

    $scope.sentence = ""

    $scope.speak = function(sentence) {
      console.log('Speak command: ', sentence)
      // Forward the speech command to the robot api
      robot.speech.speak({sentence: sentence})

      // Clear the input box
      $scope.sentence = ''

      // Remember lines
      $scope.speech_history.unshift(sentence)

      // Filter out duplicates
      var unique = [];
      var lines = $scope.speech_history.filter(function (text) {

        if (unique.indexOf(text) === -1) {
          unique.push(text);
          // return true;
        } else {
          // return false;
        }
      });
      $scope.speech_history = unique;

    }  // End of speak

  });
