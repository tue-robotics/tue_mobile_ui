'use strict';

var app = angular.module('EdGuiApp');

app.factory('menu', function () {

  // return {
  //   popup: function (x, y, actions, callback) {
  //     // Load native UI library
  //     var gui = require('nw.gui');

  //     // Create an empty menu
  //     var menu = new gui.Menu();

  //     _.forEach(actions, function (settings, action) {
  //       var options = {
  //         label: action,
  //         click: function () {
  //           callback.call(this, action);
  //         },
  //       };
  //       _.extend(options, settings);
  //       menu.append(new gui.MenuItem(options));
  //     });

  //     // Popup as context menu
  //     menu.popup(x, y);
  //   },
  // };
  return {};
});
