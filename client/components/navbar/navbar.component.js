'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {

  constructor(Auth, track, $scope, baseStation) {
    'ngInject';
    $scope.track = track;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    track.power.onChange(function () {
      $scope.power = track.power.get();
    });

    $scope.updatePower = function () {
      if ($scope.power) {
        track.power.enable();
      } else {
        track.power.disable();
      }
    };

    $scope.baseStation = baseStation;
    
    

  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
