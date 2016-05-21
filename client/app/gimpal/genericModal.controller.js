'use strict';
(function() {

  class GenericModalController {
      constructor($scope, $uibModalInstance, Title, Body) {

          $scope.title = Title;
          $scope.body = Body;

          $scope.ok = function() {
              $uibModalInstance.close('ok');
          }

          $scope.cancel = function() {
              $uibModalInstance.dismiss('cancel');
          }

      }
  }

  angular.module('gimpalApp')
    .controller('genericModalCtr', GenericModalController);
})();
