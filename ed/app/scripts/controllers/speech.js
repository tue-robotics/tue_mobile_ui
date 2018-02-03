import {union} from 'lodash';

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
      $scope.speech_history = union([sentence], $scope.speech_history);

    }  // End of speak

  });
