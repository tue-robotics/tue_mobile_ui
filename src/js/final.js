// globals
var hammertime;
var pager, position, pagerData;
var map, mapMode = 'select';
var raiseEventService;
var setLabelService;

function getDataUrl(data) {
  return 'data:image/png ;base64,' + data;
}

var pagerTemplate;
function renderPager() {
  /*
  var data = {
    ids: pagerData.ids.map(function (id, pos) {
      return {
        id: id.substr(0,4),
        active: position === pos,
      };
    }),
    image: getDataUrl(pagerData.images[position].data)
  };
  pager.html(pagerTemplate(data));
  */
}

function handleMeasurements(result) {
  pagerData = result;
  renderPager();
}

var getMeasurementsService;

function GetMeasurements() {
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
  console.log('switch to', mode);
  mapMode = mode;
}

function getPixelPosition (e) {
  // the following code is only supported in chrome
  //var x = e.offsetX;
  //var y = e.offsetY;

  var parentOffset = $(this).parent().offset();
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
  }
}

function handleClick (e) {


  var pos = getPixelPosition.call(this, e);

  console.log('click on ', pos);

  var req = new ROSLIB.ServiceRequest({
    name: 'click',
    param_names:  [      'x',      'y', 'type'],
    param_values: [""+pos.x, ""+pos.y,  mapMode],
  });

  raiseEventService.callService(req, function (result) {
    console.log(result);
  })
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
  position = 0;

  pager = $('#pager-container');

  var source   = $("#pager-template").html();
  pagerTemplate = Handlebars.compile(source);

  // get the last measurements for an object
  getMeasurementsService = new ROSLIB.Service({
      ros : ros,
      name : '/ed/gui/get_measurements',
      serviceType : 'ed/GetMeasurements'
  });
  GetMeasurements();

  // Get the map
  var mapListener = new ROSLIB.Topic({
    ros : ros,
    name : '/ed/gui/map_image',
    messageType : 'tue_serialization/Binary'
  });
  mapListener.subscribe(function(message) {
    handleMapUpdate(message);
  });
  map = $('#map-image');
  map.on('click', handleClick);

  $('#map-mode').find('button').on('click', function (e) {
    var newMode = $(this).text().trim().toLowerCase();
    switchMode(newMode);
  });

  // click service
  raiseEventService = new ROSLIB.Service({
      ros : ros,
      name : '/ed/gui/raise_event',
      serviceType : '/ed/RaiseEvent'
  });

  // label service
  setLabelService = new ROSLIB.Service({
      ros : ros,
      name : '/ed/gui/set_label',
      serviceType : 'ed/SetLabel'
  });
  $('#set-label-form').on('submit', function (e) {
    e.preventDefault();
    var labelEl = $(this).find('input[type="text"]');
    var label = labelEl.val();
    labelEl.val('');
    setLabel(label);
  });

  // catch the swipe gesture
  /*
  var final = $('#entity-image').get(0);
  hammertime = Hammer(final, {});

  hammertime.on('swipe', function (e) {
    var direction = e.direction;

    if (direction & Hammer.DIRECTION_LEFT) {
      position = position == 0 ? 0 : position - 1;
    }
    if (direction & Hammer.DIRECTION_RIGHT) {
      var maxpos = pagerData.ids.length - 1;
      position = position >= maxpos ? maxpos : position + 1;
    }

    renderPager();
  });
  */
});
