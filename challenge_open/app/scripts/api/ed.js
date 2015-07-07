(function () {

var entities_topic = '/amigo/ed/gui/entities'

function Ed (robot) {
  EventEmitter2.apply(this);

  this.ros = robot.ros;

  this.models = [];
}

Ed.prototype = Object.create(EventEmitter2.prototype);

Object.defineProperty(Ed.prototype, 'models', {
  get: function() {
    return this._models;
  },
  set: function(models) {
    this._models = models;
    this.emit('models', models);
  }
});

Ed.prototype.updateModels = function() {
  this.models = [
    { name: 'Coke', src: 'images/coca-cola.jpg' },
    { name: 'Fanta', src: 'images/coca-cola.jpg' },
    { name: 'd7f7', src: 'images/coca-cola.jpg' },
    { name: '32', src: 'images/coca-cola.jpg' },
    { name: 'd73f7', src: 'images/coca-cola.jpg' },
    { name: 'd7f27', src: 'images/coca-cola.jpg' },
    { name: 'd3217f7', src: 'images/coca-cola.jpg' },
    { name: 'd73f7', src: 'images/coca-cola.jpg' },
    { name: 'd7f7', src: 'images/coca-cola.jpg' },
    { name: 'd7f2317', src: 'images/coca-cola.jpg' },
    { name: 'd7321f7', src: 'images/coca-cola.jpg' },
    { name: 'd3213127f7', src: 'images/coca-cola.jpg' },
    { name: 'd7312f7', src: 'images/coca-cola.jpg' },
    { name: 'd7312f7', src: 'images/coca-cola.jpg' },
    { name: 'd7312f7', src: 'images/coca-cola.jpg' },
    { name: 'd317f7', src: 'images/coca-cola.jpg' },
  ];
};

window.Ed = Ed;

})();
