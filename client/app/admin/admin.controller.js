'use strict';

(function() {

class AdminController {
  constructor(User) {
    // Use the User $resource to fetch all users
    this.users = User.query(() => {
        console.log(this.users);
    });
}

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}

angular.module('gimpalApp.admin')
  .controller('AdminController', AdminController);

})();
