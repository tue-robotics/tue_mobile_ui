var robot = window.r = new API.Robot();
robot.connect();

robot.on('status', function (status) {
  console.log('status:', status);
  if (status == 'connecting') {
    document.body.style.backgroundColor = 'blue';
  } else if (status == 'connected') {
    document.body.style.backgroundColor = 'green';
  } else {
    document.body.style.backgroundColor = 'red';
  }
});

var topic = robot.ros.Topic({
  name: 'trigger',
  messageType: 'std_msgs/String',
});

var locs = location.search.split('=');
var table = locs[1] ? locs[1][0]: '?';

var button = document.getElementById('call');
button.addEventListener('click', function (e) {
  console.log('order for table:', table);
  topic.publish({
    data: 'take order for table' + table,
  });
  button.disabled = true;
  button.classList.add('btn-primary');
  setTimeout(function () {
    button.classList.remove('btn-primary');
    button.disabled = false;
  }, 500);
});

button.innerText = table;
