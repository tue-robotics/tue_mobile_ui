'use strict';

angular.module('EdGuiApp')
  .controller('ActionsCtrl', function($scope, $timeout, robot) {

  	// Trigger topic
  	var triggerTopic = robot.ros.Topic({
      name: 'trigger',
      messageType: 'std_msgs/String',
    });

    // Action client
    var actionClient = new ROSLIB.ActionClient({
      ros: robot.ros,
      serverName: 'action_server/task',
      actionName: 'action_server/TaskAction',
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
      var goal = new ROSLIB.Goal({
        actionClient,
        goalMessage: {
          recipe: JSON.stringify(recipe)
        }
      });

      // Add feedback callback
      goal.on('feedback', function(feedback) {
        console.log('Receiving feedback');
        // ToDo Rokus: publish more often
        // console.log('Feedback: ' + feedback.current_subtask);
      });

      // Add status callback
      goal.on('status', function(status) {
      	if (status.status == 1)
      	{
      		$scope.active = true;
      		// $scope.idle = false;
      	} else {
      		$scope.active = false;
      		// $scope.idle = true;
      	}
      	$scope.idle = false;  // Set idle to true by default to make sure external actions can be cancelled
      	// console.log('Receiving status');
        // console.log('Feedback: ' + feedback.current_subtask);
      });

      // Send goal
      goal.send();
    
    };  // End of 'present' 

});  // End of ActionsCtrl