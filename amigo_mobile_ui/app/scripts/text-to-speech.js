'use strict';

/* global ros */

$(document).ready(function () {

var audio_active = false;

var form = $('#texttospeech form[data-action="tts"]');
var input = $('#texttospeech input[data-action="tts"]');

var ttsTopic = new ROSLIB.Topic({
  ros : ros,
  name : '/text_to_speech/input',
  messageType : 'std_msgs/String'
});

form.on('submit', function (e) {
  e.preventDefault();
  var text = input.val();
  input.val('');
  input.focus();

  say(text);
});

// send a message to the TTS so it will say it
function say (text) {
  var message = new ROSLIB.Message({
    data : text
  });
  ttsTopic.publish(message);
}

// incoming TTS messages will also be spoken locally
ttsTopic.subscribe(function handleTextToSpeech (message) {
  var url = 'http://tts-api.com/tts.mp3?q=' + encodeURIComponent(message.data);
  if (audio_active) {
    playAudio(url);
  }
});

function playAudio (string) {
  $('audio source').attr( 'src', string );
  console.log('Playing audio file ' + string);
  $('audio')[0].load();
  $('audio')[0].play();
}

// toggle button management

$('#toggle-audio').addClass('btn-warning');

$('#toggle-audio').click(function () {
  if (!audio_active) {
    audio_active = true;
    playAudio('http://www.xamuel.com/blank-mp3-files/point1sec.mp3');
    $(this).removeClass('btn-warning');
    $(this).addClass('btn-success');
  } else {
    audio_active = false;
    $(this).removeClass('btn-success');
    $(this).addClass('btn-warning');
  }
});

}); // document ready
