'use strict';

angular.module('challengeOpenApp')
  .controller('TriggerCtrl', function ($scope, robot) {

    var topic = robot.ros.Topic({
      name: 'trigger',
      messageType: 'std_msgs/String',
    });

    $scope.trigger = function (name) {
      topic.publish({
        data: name,
      });
    };
  });
