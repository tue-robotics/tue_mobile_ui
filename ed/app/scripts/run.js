import FastClick from 'fastclick';

angular.module('EdGuiApp')
  .run(function() {
    FastClick.attach(document.body);
  });
