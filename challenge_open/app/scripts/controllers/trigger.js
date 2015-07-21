'use strict';

/* global _ */

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
