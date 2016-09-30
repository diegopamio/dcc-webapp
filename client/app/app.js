'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import ngAnimate from 'angular-animate';
// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';


import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import loco from '../components/locomotive/locomotive.service';
import base from '../components/base-station/base-station.service';
import 'angular-hotkeys';
import './app.scss';
import modal from '../components/modal/modal.service';
import 'jquery-ui-bundle/jquery-ui.min';
import 'jquery-ui-sortable';
import 'angular-ui-sortable';
import 'nz-toggle/dist/nz-toggle.min';
import 'nz-toggle/dist/nz-toggle.min.css';
import 'angular-hotkeys/build/hotkeys.min.css';
import 'ng-img-crop-full-extended/compile/minified/ng-img-crop.css';
import 'jquery-ui-bundle/jquery-ui.min.css';
import 'jquery-ui-touch-punch';

import 'angular-dragdrop';


import '../components/knobknob';
import track from '../components/track/track.service';
import 'ng-img-crop-full-extended/compile/minified/ng-img-crop';

angular.module('dccWebappApp', [ngCookies, ngResource, ngSanitize, 'btford.socket-io', uiRouter,
    uiBootstrap, _Auth, account, admin, navbar, footer, main, constants, socket, util, loco, base, 'cfp.hotkeys', 'nzToggle', track, modal, 'ngImgCrop','ui.sortable', 'ngDragDrop'
  ])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.status = {text: 'Not Connected to Base Station... please connect.'};
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });


angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['dccWebappApp'], {
      strictDi: false
    });
  });

