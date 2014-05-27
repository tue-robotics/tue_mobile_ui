var set_battery;

$(document).ready(function() {

ros.addListener('connection', function(e) {
	init();
});

var bar = $('#battery-bar');

var level = 0;

var levelMap = {
	0 : 'success',
	1 : 'warning',
	2 : 'danger',
};

function init() {
	bar.attr({
		"aria-valuemin": 0,
		"aria-valuemax": 100
	});

	set_battery(60);
}

set_battery = function(percent) {
	console.log('the battery is now at ' + percent + '%');
	bar.attr("aria-valuenow", 60);
	bar.css('width', percent+'%');
	bar.text(percent+'%');

	if (percent < 40) {
		set_level(1);
	} else {
		set_level(0);
	}
};

function set_level(new_level) {
	bar.removeClass('progress-bar-' + levelMap[level]);
	level = new_level;
	bar.addClass   ('progress-bar-' + levelMap[level]);
}

}); // document ready