'use strict';

angular.module('gimpalApp.auth', [
  'gimpalApp.constants',
  'gimpalApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
