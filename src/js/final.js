var img;
$(document).ready(function () {
	console.log("loaed");

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
  });