// globals
var hammertime;
var pager, position, pagerData;
var map;
var raiseEventService;

function getDataUrl(data) {
  return 'data:image/png ;base64,' + data;
}

var pagerTemplate;
function renderPager() {
  var data = {
    ids: pagerData.ids.map(function (id, pos) {
      return {
        id: id,
        active: position === pos,
      };
    }),
    image: getDataUrl(pagerData.images[position].data)
  };
  pager.html(pagerTemplate(data));
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

function handleClick (e) {
  // the following code is only supported in chrome
  //var x = e.offsetX;
  //var y = e.offsetY;

  var parentOffset = $(this).parent().offset();
  var x = e.pageX - ~~parentOffset.left; // double bitwise to cast to int :D
  var y = e.pageY - ~~parentOffset.top;

  console.log('click on ', x ,',', y);

  var req = new ROSLIB.ServiceRequest({
    name: 'click_select',
    param_names:  [  'x',  'y'],
    param_values: [""+x, ""+y ],
  });

  raiseEventService.callService(req, function (result) {
    console.log(result);
  })
  //  console.log('click on', x, ',', y);
}

$(document).ready(function () {
  position = 0;

  pager = $('#pager-container');

  var source   = $("#pager-template").html();
  pagerTemplate = Handlebars.compile(source);

  // get the last measurements

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

  // click service
  raiseEventService = new ROSLIB.Service({
      ros : ros,
      name : '/ed/gui/raise_event',
      serviceType : '/ed/RaiseEvent'
  });

  // catch the swipe gesture

  var final = $('#final').get(0);
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
});
