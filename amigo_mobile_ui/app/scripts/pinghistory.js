/**
* Draws a graph on a canvas
**/

// dependencies
/*global pingHistory:true, ros:true */

// globals

var canvas, ctx;

var draw, test;

var pingHistory;

var historyLength = 10*60*1000; // 10 minutes

// code wrapper
(function () {
'use strict';

draw = function () {

  // clear the canvas
  var width  = canvas.width;
  var height = canvas.height;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  // not enough datapoints
  if (pingHistory.length < 3) {
    return;
  }

  // obtain various ping stats
  var pings = pingHistory.map(function(o){return o.p;});
  var max = Math.max.apply(null, pings);
  var min = Math.min.apply(null, pings);
  var avg = (pings.reduce(function (last,cur){
    return last+cur;
  })/pings.length).toFixed(1);

  var now = +new Date();
  var start = now - historyLength;

  var pingGradient = ctx.createLinearGradient(0, height, 0, 0);
  pingGradient.addColorStop(0.0,  '#040');
  pingGradient.addColorStop(0.3,  '#080');
  pingGradient.addColorStop(1.0,  '#080');

  var pingGradientInterp = ctx.createLinearGradient(0, height, 0, 0);
  pingGradientInterp.addColorStop(0.0,  '#040');
  pingGradientInterp.addColorStop(0.3,  '#080');
  pingGradientInterp.addColorStop(1.0,  '#0c0');

  // loop over each horizontal line
  var pos = 0; // position in the pings array
  var lastpos = 0;
  for (var i = 0; i < width; i++) {

    var time = start + historyLength*i/width;

    while (pos+1 < pings.length && pingHistory[pos+1].t < time) {
      pos++;
    }

    var ping;
    if (pos === lastpos && pos+1 < pingHistory.length) {
      ctx.fillStyle = pingGradientInterp;
      // interpolate the value
      var x0 = pingHistory[pos  ].t;
      var x1 = pingHistory[pos+1].t;
      var y0 = pingHistory[pos  ].p;
      var y1 = pingHistory[pos+1].p;
      ping = y0 + (y1 - y0)*(time - x0)/(x1 - x0);
    } else {
      ctx.fillStyle = pingGradient;
      lastpos = pos;
      ping = pingHistory[pos].p;
    }

    ctx.fillRect(i, height, 1, -ping*height/max);
  }

  /*
  var i = pingHistory.length;
  while (i--) {
    var o = pingHistory[i];
    avg += o.p;

    var bar    = Math.floor(height * o.p / max);
    var barPos = Math.floor(width  * (now - o.t) / timeSpan);

  }
  */

  ctx.fillStyle = 'white';
  ctx.fillText('min/avg/max = ' + min + '/' + avg + '/' + max, 4, height - 4);
};

test = function() {
  // fill the array with mock data;
  var d = +new Date() - 100;
  while (d < +new Date()) {
    var diff = Math.random()*2 + 4;
    var ping = Math.floor(Math.random()*15+30);
    pingHistory.push({t:Math.floor(d), p:ping});
    d += diff;
  }
  draw();
};

function init() {
  if (typeof(ros) !== 'undefined') {
    ros.addListener('ping.ok', function(e) {
      pingHistory.push({t:+new Date(), p:e});
      localStorage.setItem('ping', JSON.stringify(pingHistory));
      draw();
    });
  }

  // initialize canvas stuff
  canvas = $('.history-ping')[0];
  ctx = canvas.getContext('2d');

  try {
    var pings = JSON.parse(localStorage.getItem('ping')) || [];

    // parse each item in the array as {int t:timeStamp, int p:ping}
    // throw away items older than historyLength
    var now = +new Date();
    pingHistory = [];
    for (var i=0; i<pings.length; i++) {
      var t = +pings[i].t;
      var p = +pings[i].p;

      if (p && t > now - historyLength) {
        pingHistory.push({t:t, p:p});
      }
    }
  } catch (e) {
    console.error(e.message);
    console.log('no valid ping history found, clearing localStorage');
    localStorage.setItem('ping', JSON.stringify(pingHistory));
  }

  draw();
}

// when the dom is ready, start the code
$(document).ready(init);

// end wrapper
}());
