'use strict';

angular.module('gimpalApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('gimpal', {
        url: '/gimpal',
        template: '<gimpal></gimpal>'
      });
  });
