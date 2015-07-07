(function () {

var entities_topic = '/amigo/ed/gui/entities'

function Ed (robot) {

  this.ros = robot.ros;

  this.models = [];
}

Ed.prototype.updateModels = function() {
  this.models = [
    { name: 'Coke', src: 'images/coca-cola.jpg' },
    { name: 'Fanta', src: 'images/coca-cola.jpg' },
    { name: 'd7f7', src: 'images/coca-cola.jpg' },
  ];
};

window.Ed = Ed;

})();
