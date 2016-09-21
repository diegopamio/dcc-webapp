'use strict';
const angular = require('angular');

/*@ngInject*/
export function trackService() {
  var mainTrackPower = false;
  return {
    powerState: {
      mainTrackPower: mainTrackPower
    }
  };
	// AngularJS will instantiate a singleton by calling "new" on this function
}

export default angular.module('dccWebappApp.track', [])
  .service('track', trackService)
  .name;
