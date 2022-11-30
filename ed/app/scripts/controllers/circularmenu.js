'use strict';

angular.module('EdGuiApp')
  .controller('CircularmenuCtrl', function ($scope, robot) {

    $scope.actionList = [
      {name: 'inspect', entityDescription: 'entity', icon: 'camera', color: 'red'},
      {name: 'pick-up', entityDescription: 'object', icon: 'hand-back-fist', color: 'blue'},
      {name: 'navigate-to', entityDescription: 'target-location', icon: 'arrows-alt', color: 'green'},
      {name: 'place', entityDescription: 'object', icon: 'hand-lizard', color: 'red'}
    ];

    $scope.options = { items: [] };

    $scope.$watch('selectedEntityEvent', function (entityEvent) {

      // Ignore null/empty objects
      if (!entityEvent) {
        return;
      }

      var menuElement = document.getElementById('action-menu');

      // At deselection, hide the menu
      if (!entityEvent.entity) {
        $scope.options.isOpen = false;
        menuElement.style.opacity = 0.0;
        menuElement.style.zIndex = -1;
        return;
      }

      menuElement.style.left = entityEvent.event.pageX + 'px';
      menuElement.style.top = entityEvent.event.pageY + 'px';
      menuElement.style.opacity = 1.0;
      menuElement.style.zIndex = 1;

      $scope.options.content = entityEvent.entity.id;

      $scope.options.items = $scope.actionList.map(function(action) {
        return {
          cssClass: 'fa-solid fa-' + action.icon,
          background: action.color,
          onclick: function(event) {
            // build the recipe
            var recipe = {'actions': [{'action': action.name}]};
            recipe['actions'][0][action.entityDescription] = {'id': entityEvent.entity.id};

            robot.actionServer.doAction(recipe);
            $scope.entitySelection({event: event, entity: null});
          }
        };
      });

      $scope.options.isOpen = true;

    });



  });
