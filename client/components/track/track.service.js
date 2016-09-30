'use strict';
const angular = require('angular');

/*@ngInject*/
export function trackService(locomotive) {
  var mainTrackPower = false;
  var changeCallback = _.noop;
  return {
    power: {
      enable: function() {
        if (mainTrackPower === false) {
          mainTrackPower = true;
          locomotive.stopAll();
          changeCallback();
        }
      },
      disable: function() {
        if (mainTrackPower === true) {
          mainTrackPower = false;
          locomotive.stopAll();
          changeCallback();
        }
      },
      get: function() {
        return mainTrackPower;
      },
      onChange: function (callback) {
        changeCallback = callback;
      }
    }
  };
}

export default angular.module('dccWebappApp.track', [])
  .service('track', trackService)
  .name;
