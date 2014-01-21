$( document ).ready(function() {

	var visualizationViewer = new ROS3D.Viewer({
	divID : 'visualization',
	width : $('body').width(),
	height : $('body').height(),
	antialias : true
	});

	visualizationViewer.addObject(new ROS3D.Grid());

	var MjpegViewer = new MJPEGCANVAS.Viewer({
      	divID : 'topkinect',
		host : window.location.hostname,
		width : $('body').width(),
		height : $('body').height(),
      	topic : '/amigo/top_kinect/rgb/image_color'
    });

});



