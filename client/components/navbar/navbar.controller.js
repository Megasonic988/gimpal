'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Cars',
    'state': 'gimpal'
  }, {
    'title': 'Drive',
    'state': 'drive'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('gimpalApp')
  .controller('NavbarController', NavbarController);
