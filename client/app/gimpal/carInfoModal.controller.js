'use strict';
(function() {

  class CarInfoModalController {
      constructor($scope, $uibModalInstance, carInfo) {

          $scope.carInfo = carInfo;
          console.log(carInfo);
          $scope.ok = function() {
              $uibModalInstance.dismiss('close');
          }

      }
  }

  angular.module('gimpalApp')
    .controller('carInfoModalCtr', CarInfoModalController);
})();
