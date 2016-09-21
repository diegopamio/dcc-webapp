import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
import jQuery from 'jquery';
import _ from 'lodash';

export class MainController {
  /*@ngInject*/
  constructor($http, $scope, socket, locomotive, $timeout, track, hotkeys, $uibModal, $rootScope) {
    this.$http = $http;
    this.socket = socket;

    $scope._ = _;
    $scope.track = track;
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
    $scope.locos = locomotive.getAll();
    $scope.currentLoco = $scope.locos[0];

    $scope.selectLoco = function (loco) {
      $scope.currentLoco = loco;
      $scope.updateSpeed(loco.speed || 0);
    };

    $scope.updateSpeed = function (value) {
      jQuery('#control').knobKnob('update', value / $scope.currentLoco.maxSpeed);
    };
    var numBars = 0, lastNum = -1;
    jQuery('#control').knobKnob({
      snap : 10,
      value: 154,
      turn : function(ratio){
        var bars = jQuery('.ticks');
        var colorBars = bars.find('.tick');
        numBars = Math.round(colorBars.length*ratio);
        $timeout(function () {
          $scope.currentLoco.speed = Math.floor(ratio * $scope.currentLoco.maxSpeed);
        });
        // Update the dom only when the number of active bars
        // changes, instead of on every move
        if(numBars == lastNum){
          return false;
        }
        lastNum = numBars;
        colorBars.removeClass('activetick').slice(0, numBars).addClass('activetick');
      }
    });


    var bindedHotKeys = hotkeys.bindTo($scope);
    _.forEach($scope.locos, function (loco, index) {
      bindedHotKeys.add({
        combo: (index + 1).toString(),
        description: 'Select Locomotive ' + loco.name,
        callback: function() {
          $scope.selectLoco(loco);
        }
      });
    });

    bindedHotKeys.add({
      combo: 'P',
      description: 'Turn On Main Track Power',
      callback: function () {
        track.powerState.mainTrackPower = true;
      }
    });

    bindedHotKeys.add({
      combo: 'space',
      description: 'Turn Off Main Track Power',
      callback: function () {
        track.powerState.mainTrackPower = false;
      }
    });

    bindedHotKeys.add({
      combo: 'up',
      description: 'Increases current Locomotive\'s speed',
      callback: function () {
        $scope.updateSpeed($scope.currentLoco.speed < $scope.currentLoco.maxSpeed? $scope.currentLoco.speed + 1: $scope.currentLoco.speed);
      }
    });

    bindedHotKeys.add({
      combo: 'down',
      description: 'Decreases current Locomotive\'s speed',
      callback: function () {
        $scope.updateSpeed($scope.currentLoco.speed > 0? $scope.currentLoco.speed - 1: $scope.currentLoco.speed);
      }
    });

    bindedHotKeys.add({
      combo: 'left',
      description: 'Stops current Locomotive',
      callback: function () {
        $scope.updateSpeed(0);
      }
    });

    $scope.addLoco = function () {
      var addLocoModal;
      var modalScope = $rootScope.$new();

      var scope = {modal:
      {
        title: 'Add New Locomotive',
        dismissable: true,
        buttons: [{
        classes: 'btn-primary',
        text: 'Add',
        click(newLoco) {
          addLocoModal.close(newLoco);
        }
      }, {
        classes: 'btn-default',
        text: 'Cancel',
        click(event) {
          addLocoModal.dismiss(event);
        }
      }]}};

      angular.extend(modalScope, scope);

      addLocoModal = $uibModal.open({
        template: require('../../components/locomotive/add-loco-modal.html'),
        windowClass: 'modal-default lg',
        scope: modalScope
      });

      addLocoModal.result.then(function(newLoco) {
        newLoco.speed = 0;
        newLoco.forward = true;
        $scope.locos.push(newLoco);
        bindedHotKeys.add({
          combo: ($scope.locos.length).toString(),
          description: 'Select Locomotive ' + newLoco.name,
          callback: function() {
            $scope.selectLoco(newLoco);
          }
        });
      });
    }
  }



  $onInit() {
  }

}

export default angular.module('dccWebappApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;



