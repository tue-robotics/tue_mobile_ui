/**
* Draws a graph on a canvas
**/

// libraries
/*global $:false */

// dependencies
/*global pingHistory:false */

// globals

var canvas, ctx;

var draw, test;

var pingHistory = [];

// code wrapper
(function () {
"use strict";

var barWidth = 3;

draw = function () {
    if (pingHistory.length < 3) {
        return;
    }

    var width  = canvas.width;
    var height = canvas.height;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    // obtain the max ping
    var max = Math.max.apply(null, pingHistory.map(function(o){return o.p}));

    var now = +new Date;
    var timeSpan = now - pingHistory[0].t;

    var i = pingHistory.length;
    while (i--) {
        var o = pingHistory[i];
        var bar    = Math.floor(height * o.p / max);
        var barPos = Math.floor(width  * (now - o.t) / timeSpan);
        ctx.fillStyle = "green";
        ctx.fillRect(barPos, height, 5, -bar);
    }
};

test = function() {
    // fill the array with mock data;
    var d = +new Date() - 100;
    while (d < +new Date()) {
        var diff = Math.random()*2 + 4;
        var ping = Math.floor(Math.random()*15+30);
        pingHistory.push({t:Math.floor(d), p:ping})
        d += diff;
    }
    draw();
}

function init() {
    typeof(ros) == 'undefined' || ros.addListener('ping.ok', function(e) {
        pingHistory.push({t:+new Date, p:e})
        draw();
        console.log('draw');
    });

    // initialize canvas stuff
    canvas = $('.history-ping')[0];
    ctx = canvas.getContext("2d");

    draw();
}

// when the dom is ready, start the code
$(document).ready(init);

// end wrapper
}());