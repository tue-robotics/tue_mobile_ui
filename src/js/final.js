var img, hammertime, pager, pagerTemplate, position, pagerData;

function getDataUrl(data) {
  return 'data:image/jpeg ;base64,' + data;
}

function renderPager() {
  var data = pagerData.ids.map(function (id, pos) {
    console.log(position, pos);
    return {
      id: id,
      active: position === pos,
    };
  });
  console.log(data);
  pager.html(pagerTemplate(data));
}

function handleMeasurements(result) {
  console.log(result);
  var data = result.images[1].data;
  img.prop('src', getDataUrl(data));
  pagerData = result;
  renderPager();
}

$(document).ready(function () {
  position = 0;

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

  var final = $('#final').get(0);

  hammertime = Hammer(final, {
  });

  hammertime.on('swipe', function (e) {
    var direction = e.direction;

    if (direction & Hammer.DIRECTION_LEFT) {
      console.log('left');
      position = position == 0 ? 0 : position - 1;
    }
    if (direction & Hammer.DIRECTION_RIGHT) {
      console.log('right');
      position = position >= 1 ? 1 : position + 1;
    }

    renderPager();
  });
});
