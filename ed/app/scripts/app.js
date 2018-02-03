var app = angular
  .module('EdGuiApp', ['angularCircularNavigation', 'ui.bootstrap-slider', 'ngDraggable'
  ]);

app.filter('makeNice', function () {
  return function (item) {
    item = item.charAt(0).toUpperCase() + item.slice(1);
    return item.replace(/_/g, " ");
  };
});
