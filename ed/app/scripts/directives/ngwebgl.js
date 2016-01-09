'use strict';

angular.module('EdGuiApp')
  .directive('ngWebgl', function (robot) {
    /*globals SceneRenderer*/
    return {
      restrict: 'E',
      template: '<canvas></canvas>',
      scope: {
        'entitySelection': '&onEntitySelection'
      },
      controllerAs: 'vm',
      controller: function () {
      },
      link: function postLink(scope, element) {

        function entitySelection(e) {
          console.log(e);
          var x = (e.clientX / canvas.innerWidth()) * 2 - 1;
          var y = - (e.clientY / canvas.innerHeight()) * 2 + 1;
          var obj = renderer.pickingRay(x, y);
          // console.log('pickingRay(', x, ',', y,'):', obj);
          if (obj) {
            scope.entitySelection({entity: obj, event: e});
          }
        }

        window.addEventListener('onlongpress', function(e) {
          entitySelection(e.detail);
        }, false);

        element.on('touchstart', function(e) {
          e.preventDefault();
          scope.entitySelection({entity: null, event: e});
        });

        element.on('$destroy', function () {
          console.log('ngWebgl: element is destroyed')
        });

        scope.$on('$destroy', function () {
          console.log('ngWebgl: scope is destroyed')
        });

        var canvas = element.children();
        var parent = element.parent();

        var renderer = new SceneRenderer({
          canvas: canvas.get(0),
          robot: robot
        });

        renderer.init();

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, false);

        renderer.start();

        // select entity on dblclick
        element.on('dblclick', function (e) {
          e.preventDefault();
          entitySelection(e)
        });

        // Deselect entity on mouse-down
        element.on('mousedown', function (e) {
          e.preventDefault();
          scope.entitySelection({entity: null, event: e});
        });

        function resizeCanvas() {
          renderer.setSize(parent.innerWidth(), parent.innerHeight());
        }
      }
    };
  });
