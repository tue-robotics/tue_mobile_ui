$( document ).ready(function() {
	$('#main button').click(function() {

		var data = $(this).attr('data-src');
		if (!data || data.indexOf("|") == -1) {
			console.log('no suitable data-src');
			return;
		}

        var req = data.split("|");

        // Remove whitespace due to the returns
        for (var i=0; i<req.length; i++) {
        	req[i] = req[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }

        switch (req[0]) {
		    case "sensor_msgs/JointState":
		        handleJointState(req[1],req[2],req[3]);
		        break;
		    case "amigo_msgs/AmigoGripperCommand":
		        handleAmigoGripperCommand(req[1],req[2]);
		        break;
		    case "Sound":
		        handleSpeech(req[1]);
		        break;
		    case "TextToSpeech":
		        handleSpeech($('textarea#texttospeech').val());
		        break;
		    case "SkillCommand":
		        handleActionlib(req[1])
		        break;
		}
    });
});


function handleJointState(device,name_arguments,position_arguments) {

	/* parse argument array */
	var position_arguments = position_arguments.split(",");
	for (var i=0; i<position_arguments.length; i++)	{ 
		position_arguments[i] = parseFloat(position_arguments[i]);
	}

	/* Joint names */
	var name_arguments = name_arguments.split(",");

	var topic = new ROSLIB.Topic({ros : ros,name : "/amigo/" + device + "/references", messageType : 'sensor_msgs/JointState'});

	var message = new ROSLIB.Message({
		position : position_arguments,
		name : name_arguments
	});

	topic.publish(message);
}

function handleAmigoGripperCommand(device,argument) {
	var topic = new ROSLIB.Topic({ros : ros,name : "/amigo/" + device + "/references", messageType : 'amigo_msgs/AmigoGripperCommand'});

	var message = new ROSLIB.Message({
		direction : parseInt(argument),
		max_torque : 50
	});

	topic.publish(message);
}

function handleSpeech(speech) {
	var topic = new ROSLIB.Topic({ros : ros,name : "/text_to_speech/input", messageType : 'std_msgs/String'});

	var message = new ROSLIB.Message({
		data : speech
	});

	topic.publish(message);
}

function handleActionlib(skill_command) {
	var actionlib = new ROSLIB.ActionClient({
	    ros : ros,
	    serverName : '/amigo/execute_command',
	    actionName : 'amigo_skill_server/ExecuteAction'
	});

	goal = new ROSLIB.Goal({
		actionClient : actionlib,
		goalMessage : {
		  	command : skill_command
		}
	});

	goal.send();
}