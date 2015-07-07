'use strict';

describe('Controller: ModellistCtrl', function () {

  // load the controller's module
  beforeEach(module('challengeOpenApp'));

  var ModellistCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    ModellistCtrl = $controller('ModellistCtrl', {
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ModellistCtrl.awesomeThings.length).toBe(3);
  });
});
