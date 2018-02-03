import $ from 'jquery';
import {ActionClient, Goal} from 'roslib';
import ros from './ros-connect-amigo';

$('#presentation').on('click', 'input', function (e) {
  var action = new ActionClient({
    ros: ros,
    serverName: 'action_server/task',
    actionName: 'action_server_msgs/TaskAction',
  });

  var lang = e.currentTarget.value;
  switch (lang) {
  case 'English':
    lang = 'en';
    break;
  case 'Dutch':
    lang = 'nl';
    break;
  default:
    console.error('Unknown language');
  }

  var recipe = {
    actions: [{
      action: 'demo-presentation',
      language: lang,
    }]
  }

  var goal = new Goal({
    actionClient: action,
    goalMessage: {
      recipe: JSON.stringify(recipe)
    }
  });

  goal.send();
});
