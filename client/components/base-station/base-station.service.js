'use strict';
const angular = require('angular');


/*@ngInject*/
export function baseStationService($rootScope) {
  var wsocket;

  function connect(server) {
    console.log('connecting', server);
    if (window.WebSocket) {
      currentConnection = {url: server, status: 'connecting'};
      if (!_.find(recentConnections, {url: currentConnection.url})) {
        recentConnections.push(currentConnection);
      }

      if(wsocket) {
        wsocket.close();
        currentConnection.status = 'already-opened';
      }

      $rootScope.status.text = '<i class="fa fa-spin fa-spinner"></i> Connecting to ' + currentConnection.url;
      $rootScope.status.type = 'info blink';

      wsocket = new WebSocket('wss://' + server);

      wsocket.onopen = function(event) {
        currentConnection.status = 'connected';
        $rootScope.$apply(function () {
          $rootScope.status.text = 'Connected to ' + currentConnection.url;
          $rootScope.status.type = 'success'
        });
        console.log('connected!');
        currentConnection.log = [];
      };

      wsocket.onmessage = function(event) {
        currentConnection.log.push(event.data);
        currentConnection.lastMessage = event.data;
      };
      wsocket.onclose = function(event) {
        $rootScope.$apply(function () {
          $rootScope.status.text = 'Disconnected from ' + currentConnection.url;
        });
        currentConnection.status = 'disconnected';
      };
      wsocket.onerror = function(error) {
        currentConnection.status = 'error';
        currentConnection.error = error;
        $rootScope.$apply(function () {
          $rootScope.status.text = 'Error trying to connect to ' + currentConnection.url;
          $rootScope.status.type = 'error'
        });
      };
    } else {
      alert("Your browser does not support Web Socket.");
    }
  }
  var currentConnection;
  var recentConnections = [];

  var send = function (message, callback) {

  };


  var on = function () {

  };

  var cxonnect = function (server) {

    socket.connect(server);




    socket.on('connect_error', function (data) {
      currentConnection.status = 'error';
      console.log('error de conexion + ' + data);
    });

  };

  var getCurrentConnection = function () {
    return currentConnection;
  };


  var getRecentConnections = function () {
    return recentConnections;
  };

  return {
    connect: connect,
    send: send,
    on: on,
    getCurrentConnection: getCurrentConnection,
    getRecentConnections: getRecentConnections
  }
}

export default angular.module('dccWebappApp.baseStation', [])
  .service('baseStation', baseStationService)
  .name;

