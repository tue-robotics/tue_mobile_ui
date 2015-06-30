'use strict';

angular.module('challengeOpenApp')
  .provider('robot', function () {

    // Private variables
    var hostname = 'localhost';
    var rosbridge_url = 'ws://' + hostname + ':9090';

    var RECONNECT_TIMEOUT = 5000; // ms

    function Ed () {
      this.get_entities = function () {
        return [
          { name: 'Coke', src: 'images/coca-cola.jpg' },
          { name: 'Fanta', src: 'images/coca-cola.jpg' },
          { name: 'd7f7', src: 'images/coca-cola.jpg' },
        ];
      }
    }

    // Robot constructor
    function Robot() {
      // parent constructor
      EventEmitter2.apply(this, arguments);

      this.ros = new ROSLIB.Ros();

      this.ros.on('connection', this.onConnection.bind(this));
      this.ros.on('close', this.onClose.bind(this));
      this.ros.on('error', this.onError.bind(this));

      // reconnect behavior
      this.on('status', function (status) {
        switch (status) {
          case 'closed':
            setTimeout(this.connect.bind(this), RECONNECT_TIMEOUT);
        }
      });

      this.connect();

      this.ed = new Ed();
    }

    // inherit from EventEmitter2
    Robot.prototype = Object.create(EventEmitter2.prototype);

    // status getter + setter
    Object.defineProperty(Robot.prototype, 'status', {
      get: function() {
        return _status;
      },
      set: function(status) {
        this._status = status;
        this.emit('status', status);
      }
    });

    // start connection
    Robot.prototype.connect = function () {
      console.log('connecting to ' + rosbridge_url);
      this.ros.connect(rosbridge_url);
      this.status = 'connecting';
    };

    // ros status event handling
    Robot.prototype.onConnection = function(e) {
      console.log('connection');
      this.status = 'connected';
    };

    Robot.prototype.onClose = function(e) {
      console.log('connection closed');
      this.status = 'closed';
    };

    Robot.prototype.onError = function(e) {
      // console.log('connection error');
      this.status = 'error';
    };

    // Public API for configuration
    this.setSalute = function (url) {
      salutation = s;
    };

    // Method for instantiating
    this.$get = function ($rootScope) {
      var robot = window.r = new Robot();
      return robot;
    };
  });
