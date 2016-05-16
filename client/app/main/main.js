'use strict';

angular.module('gimpalApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        template: '<main></main>',
        authenticate: true
      });
  });
