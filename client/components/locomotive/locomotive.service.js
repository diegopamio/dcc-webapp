'use strict';
const angular = require('angular');

/*@ngInject*/
export function locomotiveService($timeout) {
  var locomotives = [];

  var functions = {
    generic: [
      {
        name: 'Front Light',
        type: 'front-light',
        'default-mode': 'on-off'
      },
      {
        name: 'Rear Light',
        type: 'rear-light',
        'default-mode': 'on-off'
      },
      {
        name: 'Cab Light',
        type: 'cab-light',
        'default-mode': 'on-off'
      },
      {
        name: 'Engine Sound',
        type: 'engine-sound',
        'default-mode': 'on-off'
      },
      {
        name: 'Horn',
        type: 'horn',
        'default-mode': 'press-n-hold'
      },
      {
        name: 'Ambient Sound',
        type: 'ambient-sound',
        'default-mode': 'on-off'
      },
      {
        name: 'Generic',
        type: 'generic',
        'default-mode': 'on-off'
      }
    ],
    steam: [
      {
        name: 'Whistle',
        type: 'whistle-steam',
        'default-mode': 'pess-n-hold'
      },
      {
        name: 'Fume',
        type: 'fume',
        'default-mode': 'on-off'
      }
    ],
    diesel: [
      {
        name: 'Turbo',
        type: 'turbo',
        'default-mode': 'on-off'
      }
    ],
    electric: [
      {
        name: 'Whistle',
        type: 'whistle-human',
        'default-mode': 'trigger'
      },
      {
        name: 'Spoken Message',
        type: 'speak-message',
        'default-mode': 'trigger'
      },
      {
        name: 'Door Sound',
        type: 'door-sound',
        'default-mode': 'trigger'
      }
    ]
  };

  var newLocomotive = function (locoMetadata) {
    var setDirection = function (forward) {
      locoMetadata.direction = _.isUndefined(locoMetadata.direction) ? true: forward;
      stop();
    };

    var onChangeSpeed = _.noop;

    var onChangeSpeedCallbackRegistration = function (callback) {
      onChangeSpeed = callback;
    };

    var setSpeed = function (speed) {
      if (speed !== locoMetadata.speed) {
        locoMetadata.speed = speed;
        onChangeSpeed(speed);
      }
    };

    var stop = function () {
      setSpeed(0);
    };

    var addFunction = function (functionMetadata) {
      locoMetadata.functions.push(newFunction(functionMetadata));
    };

    var getFunctionInstances = function() {
      return locoMetadata.functions;
    };

    var newFunction = function(functionMedatadata) {
      var press = function() {
        //ToDo: Resolve the issue that makes the function to activate when I'm just dragging it inside the loco image.
        if (functionMedatadata.mode === 'press-n-hold') {
          functionMedatadata.active = true;
        }
      };

      var release = function() {
        if (functionMedatadata.mode === 'press-n-hold') {
          functionMedatadata.active = false;
        } else if (functionMedatadata.mode === 'on-off') {
          functionMedatadata.active = !functionMedatadata.active;
        } else {
          functionMedatadata.active = true;
          $timeout(function () {
            functionMedatadata.active = false;
          }, 500);
        }
      };

      var isActive = function() {
        return functionMedatadata.active
      };

      var getPosition = function() {
        return functionMedatadata.position;
      };

      var setPosition = function(newPosition) {
        functionMedatadata.position = newPosition;
      };

      var getName = function() {
        return functionMedatadata.func.name;
      };

      var getType = function() {
        return functionMedatadata.func.type;
      };

      return {
        press: press,
        release: release,
        isActive: isActive,
        getPosition: getPosition,
        setPosition: setPosition,
        getName: getName,
        getType: getType
      }
    };

    var getAvailableFunctions = function () {
      return functions[getType()].concat(functions.generic);
    };

    var getSpeed = function () {
      return locoMetadata.speed;
    };

    var getType = function() {
      return locoMetadata.type;
    };
    var isStopped = function () {
      return getSpeed() === 0;
    };

    var increaseSpeed = function (howMuch) {
      if (getSpeed() + howMuch > locoMetadata.maxSpeed) {
        setSpeed(locoMetadata.maxSpeed);
      } else {
        setSpeed(getSpeed() + howMuch);
      }
    };

    var decreaseSpeed = function (howMuch) {
      if (getSpeed() < howMuch) {
        stop();
      } else {
        setSpeed(getSpeed() - howMuch);
      }
    };

    var updateMetadata = function(newMetadata) {
      locoMetadata.name = newMetadata.name || locoMetadata.name ;
      locoMetadata.image = newMetadata.image || locoMetadata.image;
      locoMetadata.number = newMetadata.number || locoMetadata.number;
      locoMetadata.type = newMetadata.type || locoMetadata.type;
      locoMetadata.maxSpeed = newMetadata.maxSpeed || locoMetadata.maxSpeed;
    };

    locoMetadata.maxSpeed = locoMetadata.maxSpeed || 100;

    if (locoMetadata.speed) {
      setSpeed(locoMetadata.speed)
    }

    if (!locoMetadata.functions) {
      locoMetadata.functions = [];
    }
    setDirection(locoMetadata.direction);


    return {
      addFunction: addFunction,
      stop: stop,
      setDirection: setDirection,
      isGoingForward: function () {
        return locoMetadata.direction;
      },
      setSpeed: setSpeed,
      getSpeed: getSpeed,
      getName: function () {
        return locoMetadata.name;
      },
      maxSpeed: locoMetadata.maxSpeed,
      getImage: function () {
        return locoMetadata.imgUrl || locoMetadata.image || '/assets/images/' + locoMetadata.type + '.png';
      },
      isStopped: isStopped,
      updateMetadata: updateMetadata,
      onChangeSpeed: onChangeSpeedCallbackRegistration,
      increaseSpeed: increaseSpeed,
      decreaseSpeed: decreaseSpeed,
      getAvailableFunctions: getAvailableFunctions,
      getFunctionInstances: getFunctionInstances
    }
  };

	// AngularJS will instantiate a singleton by calling "new" on this function
  return {
    createDummyLocos: function () {
      locomotives.push(newLocomotive(
        {
          name: 'Electric Renfe',
          imgUrl: '/assets/images/loco2.png',
          maxSpeed: 130,
          type: 'electric',
          number: 1
        }
      ));
      locomotives.push(newLocomotive(
        {
          name: 'Militar Diesel',
          imgUrl: '/assets/images/loco1.png',
          maxSpeed: 80,
          type: 'diesel',
          number: 2
        }
      ));
      locomotives.push(newLocomotive(
        {
          name: 'Diesel Del Santi',
          imgUrl: '/assets/images/loco1.png',
          maxSpeed: 55,
          type: 'diesel',
          number: 5
        }
      ));
    },
    getAll: function () {
      return locomotives;
    },
    addLocomotive: function (locoMetadata) {
      locomotives.push(newLocomotive(locoMetadata));
    },
    stopAll: function () {
      _.forEach(locomotives, function (loco) {
        loco.stop();
      })
    }
  };
};

export default angular.module('dccWebappApp.locomotive', [])
  .service('locomotive', locomotiveService)
  .name;
