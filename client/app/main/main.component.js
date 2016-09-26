import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  /*@ngInject*/
  constructor($http, $scope, socket, locomotive, $timeout, track, hotkeys, $uibModal, $rootScope) {
    this.$http = $http;
    this.socket = socket;

    $scope._ = _;
    $scope.track = track;

    $scope.locomotiveService = locomotive;
    locomotive.createDummyLocos();
    $scope.locos = locomotive.getAll();

    $scope.powerUpTrack = function () {
      locomotive.stopAll();
      track.powerState.mainTrackPower = true;
    };

    $scope.selectLoco = function (loco) {
      $scope.currentLoco = loco;
      $scope.currentLocoDirection = loco.isGoingForward();
      loco.onChangeSpeed(function (newSpeed) {
        angular.element('#control').knobKnob('update', newSpeed / $scope.currentLoco.maxSpeed);
      });
    };

    $scope.selectLoco($scope.locos[0]);

    $scope.updateDirection = function () {
      $scope.currentLoco.setDirection($scope.currentLocoDirection);
    };


    var numBars = 0, lastNum = -1;
    angular.element('#control').knobKnob({
      snap : 10,
      value: 154,
      turn : function(ratio){
        var bars = angular.element('.ticks');
        var colorBars = bars.find('.tick');
        numBars = Math.round(colorBars.length*ratio);
        $timeout(function () {
          $scope.currentLoco.setSpeed(Math.floor(ratio * $scope.currentLoco.maxSpeed));
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

    $scope.toggleFunctionsDrawer = function () {
      $('.drawer').slideToggle('slow');
    };


    /*
     * Manage The Position of functions based on the img height/width (responsive design)
     */
    var imgEl = angular.element('#locoImage');

    angular.element(window).on('resize', function () {
      $scope.$apply(function () {
        $scope.imgHeight = Math.round(imgEl.height());
      });
    });

    $scope.imgHeight = Math.round(imgEl.height());
    $scope.$watch(
      function () {
        return Math.round(imgEl.height());
      },
      function (newValue, oldValue) {
        if (newValue != oldValue) {
          $scope.imgHeight = newValue;
        }
      }
    );

    $scope.onFunctionDrop = function (event, func) {
      if (!angular.element(func.draggable).data('do-not-duplicate')) {
        var addFunctionModal;
        var modalScope = $rootScope.$new();
        var functionInstance = {
          position: {
            //ToDo: analize corner (literaly) cases, when is dropped in the corner of the loco image
            x: (func.offset.left - event.target.x) / event.target.width * 100,
            y: (func.offset.top - event.target.y) / event.target.height
          },
          func: angular.element(func.draggable).data('func')
        };
        var scope = {
          functionInstance: functionInstance,
          modal: {
            title: 'Define New Function for ' + $scope.currentLoco.name,
            dismissable: true,
            buttons: [
              {
                classes: 'btn-primary',
                text: 'Add',
                click(returnedFunction) {
                  addFunctionModal.close(returnedFunction);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click(event) {
                  addFunctionModal.dismiss(event);
                }
              }
            ]
          }
        };

        angular.extend(modalScope, scope);


        addFunctionModal = $uibModal.open({
          template: require('../../components/locomotive/add-function-modal.html'),
          scope: modalScope
        });

        addFunctionModal.result.then(function(result) {
          $scope.currentLoco.addFunction(result);
        });
      } else {
        // func.setPosition({
        //   x: (func.offset.left - event.target.x) / event.target.width * 100,
        //   y: (func.offset.top - event.target.y) / event.target.height
        // });
      }
    };


    /*
     * Assignment of keyboard hot-keys.
     */

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
      callback: $scope.powerUpTrack
    });

    bindedHotKeys.add({
      combo: '+',
      description: 'Define New Locomotive',
      callback: function () {
        $scope.addOrEditLoco();
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
        $scope.currentLoco.increaseSpeed(1);
      }
    });

    bindedHotKeys.add({
      combo: 'down',
      description: 'Decreases current Locomotive\'s speed',
      callback: function () {
        $scope.currentLoco.decreaseSpeed(1);
      }
    });

    bindedHotKeys.add({
      combo: 'left',
      description: 'Stops current Locomotive',
      callback: function () {
        $scope.currentLoco.stop();
      }
    });

    $scope.addOrEditLoco = function (loco) {
      var isNew = _.isUndefined(loco);
      var addOrEditLocoModal;
      var modalScope = $rootScope.$new();

      var scope = {
        loco: loco,
        modal: {
          title: loco? 'Edit ' + loco.getName() + ' Locomotive': 'Add New Locomotive',
          dismissable: true,
          buttons: [
            {
              classes: 'btn-primary',
              text: loco? 'Save Changes' : 'Add',
              click(returnedLoco) {
                addOrEditLocoModal.close({loco:returnedLoco, isNew: isNew});
              }
            }, {
              classes: 'btn-default',
              text: 'Cancel',
              click(event) {
                addOrEditLocoModal.dismiss(event);
              }
            }
          ]
        }
      };

      angular.extend(modalScope, scope);

      var handleFileSelect;
      addOrEditLocoModal = $uibModal.open({
        template: require('../../components/locomotive/add-loco-modal.html'),
        scope: modalScope,
        size: 'lg',
        controller: function ($scope) {
          $scope.loco = $scope.loco || {
            image: '',
            speed: 0,
            forward: true,
            functions: []
          };
          $scope.image= '';

          $scope.rectangleWidth = 100;
          $scope.rectangleHeight = 100;

          $scope.cropper = {
            cropWidth: $scope.rectangleWidth,
            cropHeight: $scope.rectangleHeight
          };


          handleFileSelect=function(evt) {
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
              $scope.$apply(function($scope){
                $scope.image=evt.target.result;
              });
            };
            reader.readAsDataURL(file);
          };
        }
      });

      addOrEditLocoModal.rendered.then(function () {
        angular.element('#imageFile').on('change',handleFileSelect);
        angular.element('#number').focus();
      });

      addOrEditLocoModal.result.then(function(result) {
        var isNew = result.isNew;
        var loco = result.loco;
        if (isNew) {
          locomotive.addLocomotive(loco);
          bindedHotKeys.add({
            combo: ($scope.locos.length).toString(),
            description: 'Select Locomotive ' + loco.name,
            callback: function() {
              $scope.selectLoco(loco);
            }
          });
        }
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



