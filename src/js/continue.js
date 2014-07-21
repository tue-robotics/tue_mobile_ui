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

		var line = $('<div>Amigo heared: ' + text + '</div>');
		log.append(line);
		console.log(text);

	});
});