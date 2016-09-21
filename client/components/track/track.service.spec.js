'use strict';

describe('Service: track', function() {
  // load the service's module
  beforeEach(module('dccWebappApp.track'));

  // instantiate service
  var track;
  beforeEach(inject(function(_track_) {
    track = _track_;
  }));

  it('should do something', function() {
    !!track.should.be.true;
  });
});
