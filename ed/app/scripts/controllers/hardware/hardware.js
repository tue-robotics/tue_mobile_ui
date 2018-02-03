import {invert, mapValues, at, merge, clone} from 'lodash';
import {Hardware} from 'robot-api';

angular.module('EdGuiApp')
  .controller('HardwareCtrl', function($scope, robot, menu) { 	

  // battery

    $scope.battery = 50;
    $scope.batteryType = 'success';

    // hardware

    var levelColorMap = {
      STALE:        'default',
      IDLE:         'info',
      OPERATIONAL:  'success',
      HOMING:       'warning',
      ERROR:        'danger',
    };

    var levelMap = invert(Hardware.levels);

    $scope.hardware = statusToScope(robot.hardware.status);
    robot.hardware.on('status', function (status) {
      $scope.$apply(function () {
        $scope.hardware = statusToScope(status);
      });
    });

    function statusToScope(status) {
      var parts = mapValues(status, function (props) {
        var level = at(levelMap, props.level);
        var color = levelColorMap[level];
        props.class = 'btn-' + color;
        return props;
      });

      return parts;
    }

    var sendCommand = function(part, command) {
      robot.hardware.send_command(part, command);
    };
    $scope.sendCommand = sendCommand;

    var actionIcons = {
      'home':  {icon: 'icons/cogwheel.png', glyphicon: 'cog'},
      'start': {icon: 'icons/small31.png',  glyphicon: 'play'},
      'stop':  {icon: 'icons/no1.png',      glyphicon: 'stop'},
      'reset': {icon: 'icons/update.png',   glyphicon: 'refresh'},
    };

    // native context menu for selecting actions
    $scope.showMenu = function (e, part) {
      var actions = robot.hardware.status[part].actions;

      // merge the action icons in only when they are defined
      actions = mapValues(actions, function (props, action) {
        return merge(clone(props), actionIcons[action]);
      });

      menu.popup(e.x, e.y, actions, function (command) {
        var warning = actions[command].warning;

        // build a confirmation dialog
        if (warning) {
          actions = {};
          actions[warning] = {
            enabled: false,
          };
          actions = merge(actions, {
            Confirm: {
              icon: 'icons/accepted.png'
            },
            Cancel: {
              icon: 'icons/x3.png'
            }
          });

          menu.popup(e.x, e.y, actions, function (confirmResult) {
            if (confirmResult === 'Confirm') {
              sendCommand(part, command);
            }
          });
        } else {
          sendCommand(part, command);
        }
      });
    };

    $scope.showDevTools = function () {
      console.log('showDevtools');
    //require('nw.gui').Window.get().showDevTools();
    };

    $scope.reload = function () {
      location.reload();
    };
  });
