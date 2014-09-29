/**
 * Taken from scenejs (cameras/orbit.js) and adapted
 */

/* global SceneJS, scene */
/* global scenejs_canvas_width, scenejs_canvas_height */

/* jshint latedef:false */

'use strict';

// ----------------------------------------------------------------------------------------------------

SceneJS.Types.addType('ed_camera', {

  construct:function (params) {

    var lookat = this.addNode({
      type:'lookAt',

      // A plugin node type is responsible for attaching specified
      // child nodes within itself
      nodes:params.nodes
    });

    var yaw = params.yaw || 0;
    var pitch = params.pitch || 0;
    var zoom = params.zoom || 10;
    var minPitch = params.minPitch;
    var maxPitch = params.maxPitch;
    var yawSensitivity = params.yawSensitivity || 0.1;
    var pitchSensitivity = params.pitchSensitivity || 0.1;
    var zoomSensitivity = params.zoomSensitivity || 0.9;

    var lastX;
    var lastY;
    var drag_button = -1;

    var eye = params.eye || { x:0, y:0, z:0 };
    var look = params.look || { x:0, y:0, z:0};

    lookat.set({
      eye:{ x:eye.x, y:eye.y, z:-zoom },
      look:{ x:look.x, y:look.y, z:look.z },
      up:{ x:0, y:0, z:1 }
    });

    update();

    var canvas = this.getScene().getCanvas();

    canvas.addEventListener('mousedown', mouseDown, true);
    canvas.addEventListener('mousemove', mouseMove, true);
    canvas.addEventListener('mouseup', mouseUp, true);
    canvas.addEventListener('touchstart', touchStart, true);
    canvas.addEventListener('touchmove', touchMove, true);
    canvas.addEventListener('touchend', touchEnd, true);
    canvas.addEventListener('mousewheel', mouseWheel, true);
    canvas.addEventListener('contextmenu', contextMenu, true);
    canvas.addEventListener('DOMMouseScroll', mouseWheel, true);

    function mouseDown(event) {
      lastX = event.clientX;
      lastY = event.clientY;

      drag_button = event.button;

      if (event.button === 2) {  // Right mouse click
         // Compensate for possible window resizes
        var scene_x = event.clientX * scenejs_canvas_width / $('#canvas-1').width();
        var scene_y = event.clientY * scenejs_canvas_height / $('#canvas-1').height();
        scene.pick(scene_x, scene_y);
      }
    }

    // ----------------------------------------------------------------------------------------------------

    function contextMenu(event) {
      // Prevent context menu
      event.preventDefault();
    }

    // ----------------------------------------------------------------------------------------------------

    function touchStart(event) {
      lastX = event.targetTouches[0].clientX;
      lastY = event.targetTouches[0].clientY;
      drag_button = 1;
    }

    // ----------------------------------------------------------------------------------------------------

    function mouseUp() {
      drag_button = -1;
    }

    // ----------------------------------------------------------------------------------------------------

    function touchEnd() {
      drag_button = -1;
    }

    // ----------------------------------------------------------------------------------------------------

    function mouseMove(event) {
      var posX = event.clientX;
      var posY = event.clientY;
      actionMove(posX, posY, drag_button);
    }

    // ----------------------------------------------------------------------------------------------------

    function touchMove(event) {
      var posX = event.targetTouches[0].clientX;
      var posY = event.targetTouches[0].clientY;
      actionMove(posX, posY, event.button);
    }

    // ----------------------------------------------------------------------------------------------------

    function actionMove(posX, posY, button) {
      if (drag_button >= 0) {
        if (button === 0) { // Left mouse button
          yaw -= (posX - lastX) * yawSensitivity;
          pitch += (posY - lastY) * pitchSensitivity;
        } else if (button === 1) { // Middle mouse button
          var dx = (posX - lastX) * zoom * 0.002;
          var dy = (posY - lastY) * zoom * 0.002;

          var sin_yaw = Math.sin(yaw * 0.0174532925);
          var cos_yaw = Math.cos(yaw * 0.0174532925);

          look.x += sin_yaw * dx - cos_yaw * dy;
          look.y += -cos_yaw * dx - sin_yaw * dy;
        }

        update();

        lastX = posX;
        lastY = posY;
      }
    }

    // ----------------------------------------------------------------------------------------------------

    function mouseWheel(event) {
      var delta = 0;
      if (!event) {
        event = window.event;
      }
      if (event.wheelDelta) {
        delta = event.wheelDelta / 120;
        if (window.opera) {
          delta = -delta;
        }
      } else if (event.detail) {
        delta = -event.detail / 3;
      }
      if (delta) {
        if (delta < 0) {
          zoom *= (1 + zoomSensitivity);
        } else {
          zoom /= (1 + zoomSensitivity);
        }
      }
      if (event.preventDefault) {
        event.preventDefault();
      }
      event.returnValue = false;
      update();
    }

    // ----------------------------------------------------------------------------------------------------

    function update() {

      if (minPitch !== undefined && pitch < minPitch) {
        pitch = minPitch;
      }

      if (maxPitch !== undefined && pitch > maxPitch) {
        pitch = maxPitch;
      }

      var pitchMat = SceneJS_math_rotationMat4v(pitch * 0.0174532925, [0, -1, 0]);
      var eye1 = SceneJS_math_transformPoint3(pitchMat, [zoom, 0, 0]);

      var yawMat = SceneJS_math_rotationMat4v(yaw * 0.0174532925, [0, 0, 1]);
      var eye2 = SceneJS_math_transformPoint3(yawMat, eye1);

      lookat.setEye({
        x: eye2[0] + look.x,
        y: eye2[1] + look.y,
        z: eye2[2] + look.z
      });

      lookat.setLook(look);
    }
  },

  // ----------------------------------------------------------------------------------------------------

  setLook: function(l) {
  },

  // ----------------------------------------------------------------------------------------------------

  destruct:function () {
    // TODO: remove mouse handlers
  }
});
