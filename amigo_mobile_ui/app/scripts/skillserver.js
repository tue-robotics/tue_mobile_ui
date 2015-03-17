'use strict';

/* global ros */

function getSkillServerApi(callback) {

  var client = new ROSLIB.Service({
    ros : ros,
    name : 'skill_server/get_api',
    serviceType : 'robot_skill_server/GetAPI'
  });

  var req = new ROSLIB.ServiceRequest({});

  client.callService(req, function(result) { callback(result); });
}

function getCategories(functions) {

  var cats = {};

  for (var i = 0; i < functions.length; i++) {
    var cat,
        spl = functions[i].name.split('.');

    if (spl.length > 1) {
      cat = spl[0];
    } else {
      cat = 'amigo';
    }

    if(!cats[cat]){
      cats[cat] = [];
    }
    cats[cat].push(functions[i]);
  }

  return cats;
}

$( document ).ready(function() {
  // Call the skill_server api
  getSkillServerApi(function (result) {

    var functions = result.functions;
    var cats = getCategories(functions);

    var html = '<table class="buttons">';

    for (var cat in cats) {
      html += '<tr><td colspan="3" class="table-header">'+cat+'</td></tr>';
      for ( var i = 0; i < cats[cat].length; i++ ) {
        html += '<tr><td colspan="3"><button type="button" class="btn btn-default" data-src="SkillCommand|'+ cats[cat][i].name +'()">' + cats[cat][i].name + '</button></td></tr>';
      }
    }

    html += '</table>';

    $('#skillserver').html(html);
  });
});
