'use strict';

describe('Component: DriveComponent', function () {

  // load the controller's module
  beforeEach(module('gimpalApp'));

  var DriveComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    DriveComponent = $componentController('DriveComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
