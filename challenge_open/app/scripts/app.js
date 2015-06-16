'use strict';

/**
 * @ngdoc overview
 * @name challengeOpenApp
 * @description
 * # challengeOpenApp
 *
 * Main module of the application.
 */
angular
  .module('challengeOpenApp', [
    'ngAnimate',
    'ngRoute',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
