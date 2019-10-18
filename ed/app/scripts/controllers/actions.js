angular.module('EdGuiApp')
  .controller('ActionsCtrl', function($scope, $timeout, robot) {

    // Trigger topic
    var triggerTopic = robot.ros.Topic({
      name: 'trigger',
      messageType: 'std_msgs/String',
    });

    // Trigger button callback
    $scope.trigger = function (name) {
      console.log('trigger:', name);
      triggerTopic.publish({
        data: name,
      });
    };

    // Callback function for cancel button
    $scope.cancel = function() {
      console.log("Cancelling all actions");
      robot.actionServer.cancelAllActions()
    }

    // Callback function to perform autonomous presentation
    $scope.present = function (language) {
      console.log('Starting presentation in', language)

      // Check if language is 'en' or 'nl'
      if (language != 'en' && language != 'nl') {
        console.error('Language should be "en" or "nl", now it is', language);
        return;
      }

      // Create action recipe
      var recipe = {
        actions: [{
          action: 'demo-presentation',
          language: language,
        }]
      }

      // robot.actionServer.on('feedback', function(feedback) {
      //   console.log(feedback)
      //   $scope.current_subtask = feedback.current_subtask;
      // })
      // robot.actionServer.on('status', function(status) {
      //   if (status.status == 1)
      // 	{
      // 		$scope.active = true;
      // 	} else {
      // 		$scope.active = false;
      // 	}

      //   // If status > 0, there is no active task anymore.
      //   // Therefore, clear the current subtask from the scope.
      //   if (status.status > 1)
      //   {
      //     $scope.current_subtask = '';
      //   }
      // })
      robot.actionServer.doAction(recipe)
    };  // End of 'present'

  });  // End of ActionsCtrl
