'use strict';

angular.module('EdGuiApp')
  .run(function() {
    /* global FastClick */
    FastClick.attach(document.body);

  });
