'use strict';

angular.module('challengeOpenApp')
  .controller('EntityselectorCtrl', function ($scope) {
    $scope.entities = [
      { name: 'Coke', src: 'images/coca-cola.jpg' },
      { name: 'Fanta', src: 'images/coca-cola.jpg' },
      { name: 'd7f7', src: 'images/coca-cola.jpg' },
    ];
  });
