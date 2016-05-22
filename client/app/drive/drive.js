'use strict';

angular.module('gimpalApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('drive', {
        url: '/drive',
        template: '<drive></drive>'
      });
  });
