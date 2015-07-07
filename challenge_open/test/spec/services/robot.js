'use strict';

describe('Service: robot', function () {

  // load the service's module
  beforeEach(module('challengeOpenApp'));

  // instantiate service
  var robot;
  beforeEach(inject(function (_robot_) {
    robot = _robot_;
  }));

  it('should do something', function () {
    expect(!!robot).toBe(true);
  });

});
