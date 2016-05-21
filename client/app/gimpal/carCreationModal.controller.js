'use strict';
(function() {

  class CarCreationModalController {
      constructor($scope, $uibModalInstance) {

          $scope.possibleSeats = [2, 3, 4, 5, 6, 7];
          $scope.form = {};
          $scope.buttonPressed = false;

          $scope.createCar = function() {
              $scope.buttonPressed = true;
              if (!$scope.form.numSeats || !$scope.form.departTime) return;

              $uibModalInstance.close($scope.form);
          }

          $scope.cancel = function() {
              $uibModalInstance.dismiss('cancel');
          }

      }
  }

  angular.module('gimpalApp')
    .controller('carCreationModalCtr', CarCreationModalController);
})();
