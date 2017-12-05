import $ from 'jquery';
import ROSLIB from 'roslib';
import ros from './ros-connect-amigo';

$(document).ready(function () {

var audio_active = false;

var form  = $('#texttospeech form[data-action="tts"]');
var input = $('#texttospeech input[data-action="tts"]');
var log   = $('#speech-log');

var ttsTopic = new ROSLIB.Topic({
  ros : ros,
  name : 'text_to_speech/input',
  messageType : 'std_msgs/String'
});

form.on('submit', function (e) {
  e.preventDefault();
  var text = input.val();
  input.val('');
  input.focus();

  say(text);
});

log.on('click [data-action="say"]', function (e) {
  var text = $(e.target).text();
  say(text);
});

// send a message to the TTS so it will say it
function say (text) {
  var message = new ROSLIB.Message({
    data : text
  });
  ttsTopic.publish(message);

  // insert the latest text at the top
  log.prepend($(
    '<a href="javascript:void(0)" class="list-group-item" data-action="say">' + text + '</a>'
  ));

  // remove all lines for the dom
  var lines = log.find('a').detach();

  // filter unique lines
  var unique = [];
  lines = lines.filter(function (index, element) {
    var text = $(element).text();

    if (unique.indexOf(text) === -1) {
      unique.push(text);
      return true;
    } else {
      return false;
    }
  });

  // insert them back in
  log.append(lines);
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
