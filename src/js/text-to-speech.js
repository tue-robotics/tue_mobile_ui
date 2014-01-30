var audio_active = false;

function init_text_to_speech() {
	var text_to_speech_listener = new ROSLIB.Topic({
		ros : ros,
		name : '/text_to_speech/input',
		messageType : 'std_msgs/String'
	});

	text_to_speech_listener.subscribe(handleTextToSpeech);
}

function handleTextToSpeech(message) {
	var url = "http://tts-api.com/tts.mp3?q=" + encodeURIComponent(message.data);
	if (audio_active)
		playAudio(url);
}

function playAudio(string) {
	$("audio source").attr( "src", string );
	console.log("Playing audio file " + string);
	$("audio")[0].load();
	$("audio")[0].play();
}

$("#toggle-audio").click(function() {
	$(this).toggleClass("toggle-active");
	if (!audio_active) {
		audio_active = true;
		playAudio("http://www.xamuel.com/blank-mp3-files/point1sec.mp3");
	} else {
		audio_active = false;
	}
});