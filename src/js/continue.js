var input;
var log;
$(document).ready(function () {

	input = $('input.continue').focus();
	log   = $('#hear-log');

	var replaceList = [
		// locations
		"hallway table",
		"kitchen counter",
		"kitchen table",
		"couch table",
		"dinner table",
		"left sidetable",
		"right sidetable",

		"waste bin",

		// objects
		"tooth paste",
		"chocolate milk",
		"energy drink",
		"grape juice",
		"orange juice",
		"chocolate cookies",
		"strawberry cookies",
		"baby food",
	];

	$('form.continue').on('submit', function (e) {
		e.preventDefault();
		var text = input.val();
		input.val('');
		input.focus();

		text = text.replace(/[^A-Za-z ]/g, '');
		text = text.toLowerCase();
		text = text.replace('  ', ' ');

		$.each(replaceList, function (i, v) {
			text = text.replace(v, v.replace(/\s/g, ''));
		});

		var line = $('<li class="list-group-item">Amigo heard: ' + text + '</li>');
		log.prepend(line);

		var hearTopic = new ROSLIB.Topic({
			ros : ros,
			name : '/pocketsphinx/output',
			messageType : 'std_msgs/String'
		});

		var hear = new ROSLIB.Message({
			data: text,
		});
		hearTopic.publish(hear);
	});
});