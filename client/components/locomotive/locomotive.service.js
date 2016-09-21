'use strict';
const angular = require('angular');

/*@ngInject*/
export function locomotiveService() {
	// AngularJS will instantiate a singleton by calling "new" on this function
  return {
    getAll: function () {
      return [
        {
          name: 'Electric Renfe',
          imgUrl: '/assets/images/loco2.png',
          maxSpeed: 130,
          forward: true
        },
        {
          name: 'Militar Diesel',
          imgUrl: '/assets/images/loco1.png',
          maxSpeed: 80,
          forward: true
        }
      ];
    }
  };
}
export default angular.module('dccWebappApp.locomotive', [])
  .service('locomotive', locomotiveService)
  .name;
