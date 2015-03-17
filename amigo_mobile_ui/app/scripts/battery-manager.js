'use strict';

/* global ros */

var set_battery;

$(document).ready(function() {

var listener;

ros.addListener('connection', function() {
  init();
});

var bar = $('#battery-bar');

var level = 0;

var levelMap = {
  0 : 'success',
  1 : 'warning',
  2 : 'danger',
};

function init() {
  bar.attr({
    'aria-valuemin': 0,
    'aria-valuemax': 100
  });

  listener = new ROSLIB.Topic({
    ros : ros,
    name : 'battery_percentage',
    messageType : 'std_msgs/Float32'
  });

  listener.subscribe(function(message) {
    var percent = message.data; // float32
    set_battery(percent);
    console.log('Received message on ' + listener.name + ': ' + message.data);
  });
}

set_battery = function(percent) {
  console.log('the battery is now at ' + percent + '%');
  bar.attr('aria-valuenow', 60);
  bar.css('width', percent+'%');
  bar.text(percent+'%');

  if (percent < 40) {
    set_level(1);
  } else {
    set_level(0);
  }
};

function set_level(new_level) {
  bar.removeClass('progress-bar-' + levelMap[level]);
  level = new_level;
  bar.addClass   ('progress-bar-' + levelMap[level]);
}

}); // document ready
