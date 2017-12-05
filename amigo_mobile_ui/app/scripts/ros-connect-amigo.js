/**
* Maintains the connection to the Rosbridge server
*
* this package:
* - connect to ros
* - poll for lost connections
* - show dialog on connection problems
**/

import $ from 'jquery';
import ROSLIB from 'roslib';
import 'bootstrap/js/button.js';
import 'bootstrap/js/modal.js';

// configuration
var rosUrl = 'ws://' + window.location.hostname + ':9090';
var pingInterval = 5000;  // ms. The time between pings
var pingTimeout = 2000;     // ms. If ros doesn't respond within this period of time, close the connection

// Connecting to ROS.
const ros = window.ros = new ROSLIB.Ros();
export default ros;

// initialize the connection to rosbridge
function init() {
  initConnectionManager();
  initPingService();

  ros.connect(rosUrl);
  console.log('ros-connect-amigo initialized');
}

var buttonReconnect;
var modalReconnect;
function initConnectionManager() {
  // get the html elements
  buttonReconnect = $('#reconnect');
  modalReconnect  = $('#modalConnectionLost');

  buttonReconnect.click(function() {
    ros.connect(rosUrl);
  });

  ros.addListener('connection', function() {
    console.log('rosbridge connection made');
    buttonReconnect.button('loading');
  });

  ros.addListener('close', function() {
    console.log('rosbridge connection closed');
    buttonReconnect.button('reset');
    modalReconnect.modal('show');
  });

  ros.addListener('error', function() {
    console.log('rosbridge connection error');
  });

  ros.addListener('ping.ok', function(e) {
    console.log('rosbridge ping with %i ms', e);
    modalReconnect.modal('hide');
  });

  ros.addListener('ping.timeout', function(e) {
    console.log('rosbridge ping timeout of %i ms', e);
    ros.close();
  });
}

var pingClient;

function initPingService() {
  // initialize the ping service to node_alive
  pingClient = new ROSLIB.Service({
    ros : ros,
    name : 'get_alive_nodes',
    serviceType : 'node_alive/ListNodesAlive'
  });

  var pingId;
  ros.addListener('connection', function() {
    setTimeout(pingNodesAlive, pingTimeout);
    pingId = setInterval(pingNodesAlive, pingInterval);
  });
  ros.addListener('close', function() {
    clearInterval(pingId);
  });
}

function pingNodesAlive() {

  var request = new ROSLIB.ServiceRequest({});
  var start = new Date();

  setTimeout(function() {
    if (start !== -1) { // check if already received a response
      ros.emit('ping.timeout', pingTimeout);
    }
  }, pingTimeout);

  pingClient.callService(request, function(result) {
    //console.log('Result for service call: ', result);
    var diff = new Date() - start;
    start = -1;

    ros.emit('ping.ok', diff);
  });
}

// when the dom is ready, start the code
$(document).ready(init);
