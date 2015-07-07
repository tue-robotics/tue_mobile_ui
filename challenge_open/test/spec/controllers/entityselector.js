'use strict';

describe('Controller: EntityselectorCtrl', function () {

  // load the controller's module
  beforeEach(module('challengeOpenApp'));

  var EntityselectorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EntityselectorCtrl = $controller('EntityselectorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
