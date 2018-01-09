'use strict';

/* global _ */

angular.module('EdGuiApp')
  .controller('TriggerCtrl', function ($scope, robot) {

    var topic = robot.ros.Topic({
      name: 'trigger',
      messageType: 'std_msgs/String',
    });

    var amigoTopic = robot.ros.Topic({
      name: '/amigo/trigger',
      messageType: 'std_msgs/String',
    });

    $scope.trigger = function (name) {
      console.log('trigger:', name);
      topic.publish({
        data: name,
      });
    };

    $scope.triggerAmigo = function (name) {
      console.log('triggerAmigo:', name);
      amigoTopic.publish({
        data: name,
      });
    };

    $scope.creating = false;
    $scope.create_walls = function () {
      $scope.creating = true;
      robot.ed.create_walls(function () {
        _.delay(function () {
          $scope.$apply(function () {
            $scope.creating = false;
          });
        }, 1000);
      });
    };
  });
