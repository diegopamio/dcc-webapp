import angular from 'angular';

export class FooterComponent {

  constructor($scope, $rootScope) {
    'ngInject';
    $scope.status = $rootScope.status;
  }
}

export default angular.module('directives.footer', [])
  .component('footer', {
    template: require('./footer.html'),
    controller: FooterComponent
  })
  .name;
