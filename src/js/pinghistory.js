/**
* Draws a graph on a canvas
**/

// libraries
/*global $:false */

// dependencies
/*global pingHistory:false */

// globals

var canvas, ctx;

var draw;

// code wrapper
(function () {
"use strict";

var barWidth = 3;

draw = function () {
    var width  = canvas.width;
    var height = canvas.height;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    var max = Math.max.apply(null, pingHistory);

    var i = pingHistory.length;
    while (i--) {
        var bar    = Math.floor(height * pingHistory[i] / max);
        var barPos = Math.floor(width* i / pingHistory.length);
        ctx.fillStyle = "green";
        ctx.fillRect(barPos, height, 5, -bar);
        console.log(barPos, height, 5, -bar);
    }
};

function init() {

  // initialize canvas stuff
  canvas = $('.history-ping')[0];
  ctx = canvas.getContext("2d");

    snapper.open('right');
}

// when the dom is ready, start the code
$(document).ready(init);

// end wrapper
}());