'use strict';

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

    // Action
    var action = new ROSLIB.ActionClient({
      ros: robot.ros,
      serverName: 'action_server/task',
      actionName: 'action_server/TaskAction',
    });

    // Callback function to perform autonomous presentation
    $scope.present = function (language) {
      console.log('Starting presentation in ', language)

   	  // Check if language is 'en' or 'nl'
      if (language != 'en' && language != 'nl') {
      	console.error('Language should be "en" or "nl", now it is ', language);
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
        actionClient: action,
        goalMessage: {
          recipe: JSON.stringify(recipe)
        }
      });

      // Send goal
      goal.send();
    
    };  // End of 'present' 

});