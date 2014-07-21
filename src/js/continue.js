var input;
var log;
$(document).ready(function () {

	input = $('input.continue').focus();
	log   = $('#hear-log');

	$('form.continue').on('submit', function (e) {
		e.preventDefault();
		var text = input.val();
		input.val('');
		input.focus();

		text = text.replace(/[^A-Za-z ]/g, '');

		var line = $('<li class="list-group-item">Amigo heared: ' + text + '</li>');
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