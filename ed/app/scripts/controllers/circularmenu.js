'use strict';

angular.module('EdGuiApp')
  .controller('CircularmenuCtrl', function ($scope, robot) {

    $scope.actionList = [
      {name: 'inspect', icon: 'camera', color: 'red'},
      {name: 'pick-up', icon: 'hand-grab-o', color: 'blue'},
      {name: 'navigate-to', icon: 'arrows-alt', color: 'green'},
      {name: 'place', icon: 'hand-lizard-o', color: 'red'}
    ];

    $scope.options = { items: [] };

    $scope.$watch('selectedEntityEvent', function (entityEvent) {

      console.log(entityEvent);

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
          cssClass: 'fa fa-' + action.icon,
          background: action.color,
          onclick: function(event) {
            robot.actionServer.doAction(action.name, entityEvent.entity.id);
            $scope.entitySelection({event: event, entity: null});
          }
        };
      });

      $scope.options.isOpen = true;

    });



  });
