/**
* Maintains the connection to the Rosbridge server
*
* this package:
* - connect to ros
* - poll for lost connections
* - show dialog on connection problems
**/

/*global $:false */

// configuration
var rosUrl = 'ws://' + window.location.hostname + ':9090';
var pingInterval = 5000;
var pingTimeout = 50;

// global variables
var ros;

// code wrapper
(function () {
"use strict";

// initialize the connection to rosbridge
function init() {
  initConnectionManager();
  initPingService();

  // Initialize text to speech listener (say)
  init_text_to_speech();

  console.log('ros-connect-amigo initialized');
}

var buttonReconnect;
var modalReconnect;
function initConnectionManager() {
  // get the html elements
  buttonReconnect = $('#reconnect');
  modalReconnect  = $('#modalConnectionLost');

  buttonReconnect.click(function(e) {
    ros.connect(rosUrl);
  });

  // Connecting to ROS.
  ros = new ROSLIB.Ros({
    url : rosUrl
  });

  ros.addListener('connection', function(e) {
    console.log('rosbridge connection made');
    modalReconnect.modal('hide');
  });

  ros.addListener('close', function(e) {
    console.log('rosbridge connection closed');
    modalReconnect.modal('show');
  });

  ros.addListener('error', function(e) {
    console.log('rosbridge connection error');
  });
}

var pingClient;

function initPingService() {
  // initialize the ping service to node_alive
  pingClient = new ROSLIB.Service({
    ros : ros,
    name : '/get_alive_nodes',
    serviceType : 'node_alive/ListNodesAlive'
  });

  setInterval(pingNodesAlive, pingInterval);
}

function pingNodesAlive() {
  
  var request = new ROSLIB.ServiceRequest({});
  var start = new Date();
  
  setTimeout(function() {
    if (start != -1) { // check if already received a response
      console.warn('ping timeout was exceeded (%i ms)', pingTimeout);
      ros.close();
    }
  }, pingTimeout);

  pingClient.callService(request, function(result) {
    console.debug('Result for service call: ', result);
    var diff = new Date() - start;
    start = -1;
  });
}

// when the dom is ready, start the code
$(document).ready(init);

// end wrapper
}());