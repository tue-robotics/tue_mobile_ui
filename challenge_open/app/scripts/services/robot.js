'use strict';

angular.module('challengeOpenApp')
  .provider('robot', function () {

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
