// import {ServiceRequest} from 'roslib';

'use strict';

angular.module('EdGuiApp')
  .controller('LaunchCtrl', function($scope, $timeout, robot) {
    
    const ros = robot.ros;

    // Launch service
    var launchService = ros.Service({
    	name: '/auto_starter_command',
    	serviceType: 'node_alive/AutoStarterCommand'
    });

    function callLaunchService(cmd) {
    	// Setup the request
        const request = new ROSLIB.ServiceRequest({
        	command: cmd,
        });

        // Send the request
        // console.log("Reset request: ", request);
        launchService.callService(request);
    };

    // Callback function for stop button
    $scope.stop = function() {
    	console.log("Stop current launch file");
    	callLaunchService(2);  // 2: STOP
    };

    // Callback function for restart button
    $scope.restart = function() {
    	console.log("Restart current launch file");
    	callLaunchService(3);  // 3: RESTART
    };

    // /auto_starter_command/
  	// this.resetService = ros.Service({
   //    name: 'ed/reset',
   //    serviceType: 'ed_msgs/Reset'
   //  });

   //  // Action client
   //  var actionClient = new ROSLIB.ActionClient({
   //    ros: robot.ros,
   //    serverName: 'action_server/task',
   //    actionName: 'action_server_msgs/TaskAction',
   //  });

  });  // End of controller