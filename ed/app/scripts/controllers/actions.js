'use strict';

angular.module('EdGuiApp')
  .controller('ActionsCtrl', function($scope, $timeout, robot) {

  	var triggerTopic = robot.ros.Topic({
      name: 'trigger',
      messageType: 'std_msgs/String',
    });

    $scope.trigger = function (name) {
      console.log('trigger:', name);
      triggerTopic.publish({
        data: name,
      });
    };

});