'use strict';

angular.module('EdGuiApp')
  .directive('ngTeleopCanvas', function () {
    return {
      restrict: 'E',
      template: '<canvas></canvas>',
      scope: {
        'percentageChanged': '&onPercentageChanged'
      },
      controllerAs: 'vm',
      controller: function () {
      },
      link: function postLink(scope, element) {

        element.on('$destroy', function () {
          console.log('ngTeleopCanvas: element is destroyed')
        });

        scope.$on('$destroy', function () {
          console.log('ngTeleopCanvas: scope is destroyed')
        });

        var canvas = element.children()[0];
        var ctx = canvas.getContext('2d');

        var parent = element.parent();

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, false);

        function resizeCanvas() {
          canvas.width = parent.width();
          canvas.height = parent.width();
        }

        /* LOGIC */

        var startPos;
        var currentPos;
        var publishing = false;

        setInterval(function() {
          if (publishing) {
            if (!currentPos || !startPos) {
              return;
            }

            var dx = currentPos.x - startPos.x;
            var dy = currentPos.y - startPos.y;

            var py = - dy / canvas.height;
            var px = dx / canvas.width;

            scope.percentageChanged({px: px, py: py});
          }
        }, 100);

        function start(x, y) {
          startPos = {x: x, y: y};
          publishing = true;
          update();
        }

        function move(x, y) {
          if (!startPos)
            return;

          currentPos = {x: x, y: y};
          update();
        }

        function end() {
          startPos   = false;
          currentPos = false;

          publishing = false;

          update();

          scope.percentageChanged({px: 0, py: 0});
        }

        function update() {
          clearCanvas();
          draw(startPos, currentPos);
        }

        function clearCanvas() {
          ctx.fillStyle = '#4D4D4D';
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function draw(pos, thumbPos) {
          var r, radgrad;

          if (pos)
          {
            ctx.save(); // save original state
            ctx.translate(pos.x, pos.y);

            r = 60;

            radgrad = ctx.createRadialGradient(0,0,0,0,0,2*r);
            radgrad.addColorStop(0   , 'rgba(0,0,0,0)');
            radgrad.addColorStop(0.4 , 'rgba(0,0,0,0)');
            radgrad.addColorStop(0.45, 'rgba(0,0,0,1)');
            radgrad.addColorStop(0.55, 'rgba(0,0,0,1)');
            radgrad.addColorStop(0.6 , 'rgba(0,0,0,0)');
            radgrad.addColorStop(1   , 'rgba(0,0,0,0)');

            // draw shape
            ctx.fillStyle = radgrad;
            ctx.fillRect(-2*r, -2*r, 4*r, 4*r);

            ctx.restore(); // restore original state
          }

          if (thumbPos)
          {
            ctx.save(); // save original state
            ctx.translate(thumbPos.x, thumbPos.y);

            r = 45;

            radgrad = ctx.createRadialGradient(0,0,0,0,0,r);
            radgrad.addColorStop(0   , 'rgba(0,0,0,1)');
            radgrad.addColorStop(0.9 , 'rgba(0,0,0,1)');
            radgrad.addColorStop(1   , 'rgba(0,0,0,0)');

            // draw shape
            ctx.fillStyle = radgrad;
            ctx.fillRect(-r, -r, 2*r, 2*r);

            ctx.restore(); // restore original state
          }
        }

        // ELEMENT BINDING

        element.on('mousedown', function(e) {
          start(e.offsetX, e.offsetY);
        });

        element.on('touchstart', function(e) {
          start(e.originalEvent.touches[0].offsetX, e.originalEvent.touches[0].offsetY);
        });

        element.on('mousemove', function(e) {
          move(e.offsetX, e.offsetY);
        });

        element.on('touchmove', function(e) {
          move(e.originalEvent.touches[0].offsetX, e.originalEvent.touches[0].offsetY);
        });

        element.on('mouseup', function(e) {
          end();
        });

        element.on('mouseleave', function(e) {
          end();
        });

        element.on('touchend', function(e) {
          end();
        });
      }
    };
  });
