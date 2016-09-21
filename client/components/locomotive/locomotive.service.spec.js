'use strict';

describe('Service: locomotive', function() {
  // load the service's module
  beforeEach(module('dccWebappApp.locomotive'));

  // instantiate service
  var locomotive;
  beforeEach(inject(function(_locomotive_) {
    locomotive = _locomotive_;
  }));

  it('should do something', function() {
    !!locomotive.should.be.true;
  });
});
