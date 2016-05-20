'use strict';
(function() {

  class GimpalComponent {

    POLL_TIME_MILLIS = 5000;

    constructor($scope, $http, Auth, $uibModal) {

        this.$http = $http;
        this.$uibModal = $uibModal;

        this.users = [];
        this.me = Auth.getCurrentUser(); // get information of current user
        this.cars = [];

        this.myCarId; // the mongoose id of the car I am in (whether driver or rider)
        this.userIsDriver = false;
        this.lastUpdated = (new Date()).getTime(); // for displaying the time

        this.getUsers();
        this.getCars();

        // poll server to refresh data
        setInterval(this.getUsers.bind(this), this.POLL_TIME_MILLIS);
        setInterval(this.getCars.bind(this), this.POLL_TIME_MILLIS);

        /**
         * Add my id to the riderIds array in the specified car. The "carIndex"
         * parameter is passed to this function with $index, and is used to find
         * the car. This function is bound to $scope because it seemed necessary
         * if I wanted to use $index in the html file.
         */
        $scope.addSelfToCar = (carIndex) => {

            var car_copy = angular.copy(this.cars[carIndex]);

            // if (car.riderIds.length >= car.seats) {
            //     console.log('Error: car is already at max capacity');
            //     return;
            // }

            // prevent ourselves from joining car repeatedly
            if (this.myCarId === car_copy._id) {
                console.log('Error: attempting to re-join car already joined');
                return;
            }

            // do not set class properties until success callback
            var myCarId = car_copy._id;
            var myInfo = this.me._id; // add myself to riderIds array
            car_copy.riderIds.push(myInfo);

            this.$http.put('/api/cars/' + car_copy._id, car_copy)
            .then((response) => {
                console.log('added self to car');
                this.myCarId = car_copy._id;
                this.getCars(); //update __v version number in car object by re-fetching from server
            }, (error) => {
                // TO DO: add modal popup for error message
                console.log(error);
            });
        }

        /**
         * Remove a car from the array of cars. Send a delete request to the server.
         */
        $scope.deleteCar = (carIndex) => {
            var car = this.cars[carIndex];

            this.$http.delete('/api/cars/' + car._id)
            .then((response) => {
                console.log('deleted car');
                console.log(response);
                this.getCars(); //update __v version number in car object by re-fetching from server
                // NOTE: if you do not refetch data from server after modifying a
                // schema, you may encounter a VersionError
            }, (error) => {
                console.log(error);
            });
        }

        /**
         * Present a modal view to give user extra information about the people
         * riding in the car.
         */
        $scope.openCarInfoModal= (carIndex) => {
            var car = this.cars[carIndex];

            // Massage data for the modal view so it can focus on presentation
            var carInfo = {
                driver: this.findUserForId(car.driverId),
                riders: car.riderIds.map(this.findUserForId.bind(this)),
                seats: car.seats,
                comments: car.comments,
                departTime: car.departTime
            };

            var modalInstance = this.$uibModal.open({
                animation: true,
                templateUrl: 'app/gimpal/carInfoModal.html',
                controller: 'carInfoModalCtr',
                size: 'lg',
                resolve: {
                    carInfo: () => {
                        return carInfo;
                    }
                }
            });

            modalInstance.result.then(function() {}, function(reason) {console.log(reason);});
        }

    }

    /**
     * Get the array of users from the server.
     */
    getUsers() {
        this.$http.get('/api/users')
        .then((response) => {
            this.users = response.data;
        }, (error) => {
            console.log(error);
        });
    }

    /**
     * Get the array of cars from the server. Analyzes data to check if we are
     * a driver or rider in any of the cars, and sets this.userIsDriver and
     * this.myCarId correspondingly.
     */
    getCars() {
        this.$http.get('/api/cars')
        .then((response) => {
            this.cars = response.data;

            // check if I am in any of these cars right now
            for (var i = 0; i < this.cars.length; i++) {
                var car = this.cars[i];

                //check if I am a driverId
                if (car.driverId === this.me._id) {
                    this.myCarId = car._id;
                    this.userIsDriver = true;
                    return;
                }
                this.userIsDriver = false; // I am not a driver

                //check if I am a rider
                for (var j = 0; j < car.riderIds.length; j++) {
                    var riderId = car.riderIds[j];
                    if (this.me._id === riderId) {
                        this.myCarId = car._id;
                        return;
                    }
                }

                this.myCarId = null; // I am not a rider

                this.lastUpdated = (new Date()).getTime();
            }
        }, (error) => {
            console.log(error);
        });
    }

    /**
     * Create a car with driverId set as my own, then post to the server with
     * the information.
     */
    createCar() {

        var modalInstance = this.$uibModal.open({
            animation: true,
            templateUrl: 'app/gimpal/carCreationModal.html',
            controller: 'carCreationModalCtr',
            size: 'lg',
        });

        modalInstance.result.then( (formData) => {

            var newCar = {
                driverId: this.me._id,
                active: true,
                riderIds: [],
                seats: formData.numSeats,
                organization: this.me.organization,
                departTime: formData.departTime,
                comments: formData.comments
            };

            this.$http.post('/api/cars', newCar)
            .then((response) => {
                this.userIsDriver = true;
                this.getCars();
            }, (error) => {
                console.log(error);
            });

        }, function(reason) {
            // quit
            console.log(reason);
        });
    }

    /**
     * Find the user in the this.users array corresponding to a given id. The ids
     * are automatically generated by mongoose in the backend.
     */
    findUserForId(id) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i]._id === id) {
                return this.users[i];
            }
        }
        // // user not found
        // console.log('Error: user not found in function ctr.findUserForId(id)');
    }

    /**
     * Remove my id from riderIds array of car that I am in
     */
    leaveCar() {
        for (var i = 0; i < this.cars.length; i++) {
            var car = this.cars[i];
            if (car._id === this.myCarId) {
                for (var j = 0; j < this.cars[i].riderIds.length; j++) {
                    if (car.riderIds[j] === this.me._id) {
                        car.riderIds.splice(j,1); //remove myself from the riders
                        this.$http.put('/api/cars/' + car._id, car)
                        .then((response) => {
                            this.getCars(); //update __v version number in car object by re-fetching from server
                            console.log('removed self from car');
                        }, (error) => {
                            console.log(error);
                        });
                        this.myCarId = null;
                        return;
                    }
                }
            }
        }
        console.log('Error: User is not in this car; could not remove user.');
    }

    /**
     * For debugging
     */
    showProperties() {
        console.log(this.cars);
        console.log(this.myCarId);
        console.log(this.userIsDriver);
    }
  }

  angular.module('gimpalApp')
    .component('gimpal', {
      templateUrl: 'app/gimpal/gimpal.html',
      controller: GimpalComponent,
      controllerAs: 'ctr'
  });

})();
