/*global $:false */

// configs
var rosUrl = 'ws://' + window.location.hostname + ':9090';

// holds the connection to rosbridge
var ros, teleop;

// code wrapper
(function () {
"use strict";

// initialize the connection to rosbridge
function initTeleop() {

  // get the html elements
  var buttonReconnect = $('#reconnect');
  var modalReconnect  = $('#modalConnectionLost');

  buttonReconnect.click(function(e) {
    ros.connect(rosUrl);
  });

  // Connecting to ROS.
  ros = new ROSLIB.Ros({
    url : rosUrl
  });

  ros.addListener('connection', function(e) {
    //console.log('websocket connection made', e);
    modalReconnect.modal('hide');
  });

  ros.addListener('close', function(e) {
    //console.log('websocket connection closed', e);
    modalReconnect.modal('show');
  });

  ros.addListener('error', function(e) {
    //console.log('websocket connection error', e);
  });

  // Initialize the teleop.
  teleop = new TELEOP.Teleop({
    ros : ros,
    topic : '/amigo/base/references'
  });

}

// when the dom is ready, start the code
$(document).ready(initTeleop);

// end wrapper
}());