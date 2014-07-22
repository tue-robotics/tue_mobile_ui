var img, hammertime, pager, pagerTemplate;

function getDataUrl(data) {
  return 'data:image/jpeg ;base64,' + data;
}

function handleMeasurements(result) {
  console.log(result);
  var data = result.images[1].data;
  img.prop('src', getDataUrl(data));
  pager.html(pagerTemplate(result));
}

$(document).ready(function () {
  var position = 0;

  img = $('#data-image');
  pager = $('#pager-container');

  var source   = $("#pager-template").html();
  pagerTemplate = Handlebars.compile(source);

  measurements = new ROSLIB.Service({
      ros : ros,
      name : '/ed/get_measurements',
      serviceType : 'ed/GetMeasurements'
  });

  var req = new ROSLIB.ServiceRequest({});

  measurements.callService(req, function(result) {
    handleMeasurements(result);
  });

  /*
  listener.subscribe(function(message) {
    var data = 'data:image/png;base64,' + message.data;
    img.prop('src', data);
  });
  */

  var final = $('#final').get(0);

  hammertime = Hammer(final, {
  });

  hammertime.on('swipe', function (e) {
    var direction = e.direction;

    if (direction & Hammer.DIRECTION_LEFT) {
      console.log('left')
    }
    if (direction & Hammer.DIRECTION_RIGHT) {
      console.log('right');
    }
  });
});
