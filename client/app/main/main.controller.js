'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.awesomeThings = [];

    this.currentUser = Auth.getCurrentUser();

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });

    $scope.$watch(() => {
        return this.awesomeThings;
    }, function(newVal, oldVal) {

        console.log(newVal);

    }, _.isEqual);
  }

  $onInit() {
    this.$http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      console.log(this.awesomeThings);
      this.socket.syncUpdates('thing', this.awesomeThings);
    });
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
}

angular.module('gimpalApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
