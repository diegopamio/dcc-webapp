'use strict';

describe('Service: baseStation', function() {
  // load the service's module
  beforeEach(module('dccWebappApp.baseStation'));

  // instantiate service
  var baseStation;
  beforeEach(inject(function(_baseStation_) {
    baseStation = _baseStation_;
  }));

  it('should do something', function() {
    !!baseStation.should.be.true;
  });
});
