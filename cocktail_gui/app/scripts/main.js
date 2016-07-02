var robot = window.r = new API.Robot();
robot.connect();

var topic = robot.ros.Topic({
  name: 'trigger',
  messageType: 'std_msgs/String',
});

var locs = location.search.split('=');
var table = locs[1] || '?';

var button = document.getElementById('call');
button.addEventListener('click', function (e) {
  console.log('order for table:', table);
  topic.publish({
    data: 'take order for table' + table,
  });
});

button.innerText = table;
