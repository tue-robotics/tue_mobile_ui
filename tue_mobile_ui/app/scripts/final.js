'use strict';

/* global ros */

// globals
var pager, pagerData;
var map, mapMode = 'select';
var raiseEventService;
var setLabelService;

function getDataUrl(data) {
  return 'data:image/png ;base64,' + data;
}

var pagerTemplate;
function renderPager() {
  // only render the first image
  var data = pagerData;
  data.id = data.id ? data.id.substr(0,4) : 'no selected object';
  data.image = {
    info: data.image ? data.image.info : '',
    data: data.image ? getDataUrl(data.image.data) : '',
  };

  //console.log('render:', data);
  pager.html(pagerTemplate(data));
}

function handleMeasurements(result) {
  console.log(result);
  pagerData = {
    id: result.ids[0],
    image: result.images[0]
  };
  renderPager();
}

var getMeasurementsService;

function getMeasurements() {
  // handle the incoming data

  var req = new ROSLIB.ServiceRequest({});

  getMeasurementsService.callService(req, function(result) {
    handleMeasurements(result);
  });
}

function handleMapUpdate (msg) {
  map.prop('src', getDataUrl(msg.data));
}

function switchMode(mode) {
  mapMode = mode;
}

function getPixelPosition (e) {
  /*jshint bitwise:false */

  // the following code is only supported in chrome
  //var x = e.offsetX;
  //var y = e.offsetY;

  var parentOffset = $(this).offset();
  var x = e.pageX - parentOffset.left; // double bitwise to cast to int :D
  var y = e.pageY - parentOffset.top;

  // handle css scaling
  var xScale = this.width/this.naturalWidth;
  var yScale = this.height/this.naturalHeight;

  x = x/xScale;
  y = y/yScale;

  return {
    x: ~~x,
    y: ~~y,
  };
}

function raiseEvent (e) {
  var data = {
    name: e.name,
    param_names: _.keys(e.params),
    param_values: _.values(e.params).map(function (v) { return ''+v; }),
  };

  var req = new ROSLIB.ServiceRequest(data);
  raiseEventService.callService(req, function (result) {
    console.log(result);
  });
}

function handleClick (e) {
  var pos = getPixelPosition.call(this, e);

  console.log('click on ', pos);

  var req = new ROSLIB.ServiceRequest({
    name: 'click',
    param_names:  [      'x',      'y', 'type'],
    param_values: [''+pos.x, ''+pos.y,  mapMode],
  });

  raiseEventService.callService(req, function (result) {
    console.log(result);
  });

  // also refresh the measurement view
  getMeasurements();
}

function setLabel(label) {
  console.log('set label: ', label);

  var req = new ROSLIB.ServiceRequest({
    id: '',
    label: label,
  });

  setLabelService.callService(req, function(result) {
    console.log(result);
  });
}

$(document).ready(function () {
  pager = $('#pager-container');

  var source   = $('#pager-template').html();
  pagerTemplate = Handlebars.compile(source);

  // get the last measurements for an object
  getMeasurementsService = new ROSLIB.Service({
      ros : ros,
      name : 'ed/gui/get_measurements',
      serviceType : 'ed_msgs/GetMeasurements'
  });
  getMeasurements();

  // Get the map
  var mapListener = new ROSLIB.Topic({
    ros : ros,
    name : 'ed/gui/map_image',
    messageType : 'tue_serialization/Binary'
  });
  mapListener.subscribe(function(message) {
    handleMapUpdate(message);
  });
  map = $('#map-image');
  map.on('click', handleClick);

  $('#map-pan').find('button').on('click', function () {
    var panMode = $(this).text().trim().toLowerCase();
    console.log(panMode);
    var params;
    switch (panMode) {
      case 'left':
        params = { dx: -1, dy:  0 };
        break;
      case 'right':
        params = { dx:  1, dy:  0 };
        break;
      case 'up':
        params = { dx:  0, dy:  1 };
        break;
      case 'down':
        params = { dx:  0, dy: -1 };
        break;
    }
    raiseEvent({
      name: 'pan',
      params: params,
    });
  });

  $('#map-zoom').find('button').on('click', function () {
    var zoomMode = $(this).text().trim().toLowerCase();
    if (zoomMode === 'in') {
      console.log('zoom in');
      raiseEvent({
        name: 'zoom',
        params: {
          factor: 1.5,
        }
      });
    } else if (zoomMode === 'out') {
      console.log('zoom out');
      raiseEvent({
        name: 'zoom',
        params: {
          factor: 1/1.5,
        }
      });
    }
  });

  $('#map-explore').on('click', function () {
    raiseEvent({
      name: 'explore',
      params: {},
    });
  });

  $('#map-wait').on('click', function () {
    raiseEvent({
      name: 'wait',
      params: {},
    });
  });

  $('#map-mode').find('button').on('click', function () {
    var newMode = $(this).text().trim().toLowerCase();
    switchMode(newMode);
  });

  // click service
  raiseEventService = new ROSLIB.Service({
      ros : ros,
      name : 'ed/gui/raise_event',
      serviceType : 'ed_msgs/RaiseEvent'
  });

  // label service
  setLabelService = new ROSLIB.Service({
      ros : ros,
      name : 'ed/gui/set_label',
      serviceType : 'ed_msgs/SetLabel'
  });
  $('#set-label-form').on('submit', function (e) {
    e.preventDefault();
    var labelEl = $(this).find('input[type="text"]');
    var label = labelEl.val();
    labelEl.val('');
    setLabel(label);
  });
});
