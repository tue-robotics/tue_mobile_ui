import $ from 'jquery';
import {Topic, Message} from 'roslib';
import ros from './ros-connect-amigo';

var input;
var log;
$(document).ready(function () {

  input = $('#amigohear input.continue').focus();
  log   = $('#hear-log');

  $('form.continue').on('submit', function (e) {
    e.preventDefault();
    var text = input.val();
    input.val('');
    input.focus();

    text = text.replace(/[^A-Za-z ]/g, '');
    text = text.toLowerCase();
    text = text.replace('  ', ' ');

    var line = $('<li class="list-group-item">Amigo heard: ' + text + '</li>');
    log.prepend(line);

    var hearTopic = new Topic({
      ros : ros,
      name : 'hmi/string',
      messageType : 'std_msgs/String'
    });

    var hear = new Message({
      data: text,
    });
    hearTopic.publish(hear);
  });
});
