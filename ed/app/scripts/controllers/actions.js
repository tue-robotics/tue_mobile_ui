import {Goal, ActionClient} from 'roslib';

angular.module('EdGuiApp')
  .controller('ActionsCtrl', function($scope, $timeout, robot) {

  	// Trigger topic
  	var triggerTopic = robot.ros.Topic({
      name: 'trigger',
      messageType: 'std_msgs/String',
    });

    // Action client
    var actionClient = new ActionClient({
      ros: robot.ros,
      serverName: 'action_server/task',
      actionName: 'action_server_msgs/TaskAction',
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
    	console.log("Canceling current action");
    	actionClient.cancel();
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

      // Create actionlib goal
      var goal = new Goal({
        actionClient: actionClient,
        goalMessage: {
          recipe: JSON.stringify(recipe)
        }
      });

      // Add feedback callback
      goal.on('feedback', function(feedback) {
        $scope.current_subtask = feedback.current_subtask;
      });

      // Add status callback
      goal.on('status', function(status) {
      	if (status.status == 1)
      	{
      		$scope.active = true;
      	} else {
      		$scope.active = false;
      	}

        // If status > 0, there is no active task anymore. 
        // Therefore, clear the current subtask from the scope.
        if (status.status > 1)
        {
          $scope.current_subtask = '';
        }
      });

      // Send goal
      goal.send();
    
    };  // End of 'present' 

});  // End of ActionsCtrl