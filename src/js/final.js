var img, hammertime;

$(document).ready(function () {
  var position = 0;

  img = $('#data-image');

  var listener = new ROSLIB.Topic({
    ros : ros,
    name : '/amigo_mobile_gui/image',
    messageType : 'tue_serialization/Binary'
  });

  listener.subscribe(function(message) {
    var data = 'data:image/png;base64,' + message.data;
    img.prop('src', data);
  });

  var final = $('#final').get(0);

  hammertime = Hammer(final, {
    drag_max_touches: 1,
    prevent_default: true
  });

  hammertime.on('swipe', function (e) {
    var direction = e.gesture.direction;

    switch (direction) {
      case 'left': {
        console.log('left');
      } break;
      case 'right': {
        console.log('right');
      } break;
      default: {
        console.log(e);
      } break;
    }
  });
});
