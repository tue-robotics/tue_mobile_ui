/**
* Control pad like interface for TeleOp via HTML5 Canvas
*
* this package:
* - requires a ros connection
* - initializes a TeleOp
**/

import $ from 'jquery';
import Hammer from 'hammerjs';
import Teleop from './teleop.js';
import ros from './ros-connect-amigo';

// global variables

var teleop;

var cursorImg;

// code wrapper
(function () {
'use strict';

// private variables
var canvas, ctx;

var offset; // position of the canvas relative to the document

var startPos;
var currentPos;

function initTeleop() {
  // Initialize the teleop.
  teleop = new Teleop({
    ros : ros,
    topic : 'base/references'
  });
}

// used to initialize classes and bind events
function init() {

  // initialize canvas stuff
  canvas = $('#teleop-canvas')[0];
  ctx = canvas.getContext('2d');
  loadAssets();

  $(window).resize(resizeCanvas)
    .resize(); // force resize

  var mc = Hammer(canvas, {
    touchAction: 'none',
  });
  mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

  mc.on('pan', function(e) {
    /*jshint bitwise:false */
    var pos = e.center;

    if (e.eventType & Hammer.INPUT_START) {
      console.log('input start!!!');
    }
    if (e.eventType & Hammer.INPUT_MOVE) {
      currentPos = convertPageXY(pos.x, pos.y);
      console.log('drag', currentPos);
      updateNavigation();
    }
    if (e.eventType & Hammer.INPUT_END) {
      panStop();
    }
    if (e.eventType & Hammer.INPUT_CANCEL) {
      panStop();
    }
  });

  mc.on('panstart', function(e) {
    var pos = e.center;
    startPos = convertPageXY(pos.x, pos.y);
    publishing = true;

    updateNavigation();
  });

  function panStop() {
    startPos   = false;
    currentPos = false;

    publishing = false;
    teleop.sendTwist(0, 0, 0);

    updateNavigation();
  }

  initTeleop();

  window.setInterval(updateVelocity, 100);
}

function loadAssets() {
  /*
  cursorImg = new Image();
  cursorImg.src = 'images/cursor.svg';
  $(cursorImg).load(function(){
    draw();
  });
  */
}

function resizeCanvas() {

  offset = $(canvas).offset();

  canvas.width = $(window).width();
  canvas.height = $(window).height() - 50; // for the nav bar

  window.scrollTo(0, 1);

  draw();
}

function convertPageXY(x, y) {
  return {x: x, y: y - 50};
}

function drawImageCentered(img, x, y, w, h)
{
  ctx.drawImage(img, x - w/2, y - h/2, w, h);
}

function drawController(pos, thumbPos)
{
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

function draw() {
  //drawCircle(startPos.x  , startPos.y  , 50, 'rgba(0,0,255,.5)');
  //drawCircle(currentPos.x, currentPos.y, 50, '#00FF00A');

  drawController(startPos, currentPos);
}

function clearCanvas() {
  ctx.fillStyle = '#4D4D4D';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function sendCmdVel() {

  if (!currentPos || !startPos) {
    return;
  }

  var dx = currentPos.x - startPos.x;
  var dy = currentPos.y - startPos.y;

  speed = -dy/canvas.height;
  theta = -dx/canvas.width;

  teleop.sendTwist(speed, 0, theta);
}

var publishing = false;
var speed, theta;
function updateVelocity() {
    if (publishing) {
        sendCmdVel();
    }
}

function updateNavigation() {
  clearCanvas();
  draw();
}

// when the dom is ready, start the code
$(document).ready(init);

// end wrapper
}());
