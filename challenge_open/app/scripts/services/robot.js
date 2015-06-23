'use strict';

angular.module('challengeOpenApp')
  .provider('robot', function () {

    // Private variables
    var url = 'ws://asdf';

    function Ed () {
      this.get_entities = function () {
        return [
          { name: 'Coke', src: 'images/coca-cola.jpg' },
          { name: 'Fanta', src: 'images/coca-cola.jpg' },
          { name: 'd7f7', src: 'images/coca-cola.jpg' },
        ];
      }
    }

    // Private constructor
    function Robot() {
      this.ed = new Ed();
    }

    // Public API for configuration
    this.connect = function (url) {
      salutation = s;
    };

    // Method for instantiating
    this.$get = function () {
      return new Robot();
    };
  });
