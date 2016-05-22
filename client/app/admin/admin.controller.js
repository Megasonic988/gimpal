'use strict';

(function() {

	class AdminController {

        POLL_TIME_MILLIS = 5000;

		constructor(User, $http, $scope) {

            this.$http = $http;

            this.lastUpdated = (new Date()).getTime();
            this.users = [];
            this.cars = [];


            this.getUsers();
			this.getCars();

            this.usersPoll = setInterval(this.getUsers.bind(this), this.POLL_TIME_MILLIS);
            this.carsPoll = setInterval(this.getCars.bind(this), this.POLL_TIME_MILLIS);

			// Use the User $resource to fetch all users
			this.users = User.query(() => {
				console.log(this.users);
			});

            $scope.deleteCar = (carIndex) => {
                var car = this.cars[carIndex];
                this.$http.delete('/api/cars/' + car._id)
                .then((response) => { // first callback is when modal is 'closed'
                    console.log('deleted car');
                    console.log(response);
                    this.getCars(); //update __v version number in car object by re-fetching from server
                    // NOTE: if you do not refetch data from server after modifying a
                    // schema, you may encounter a VersionError
                }, (error) => {
                    console.log(error);
                });
            }
		}

		delete(user) {
			user.$remove();
			this.users.splice(this.users.indexOf(user), 1);
		}

        getUsers() {
			this.$http.get('/api/users')
				.then((response) => {
					this.users = response.data;
				}, (error) => {
					console.log(error);
				});
		}

        getCars() {
			this.$http.get('/api/cars')
			.then((response) => {
                this.lastUpdated = (new Date()).getTime();
                this.loaded = true;
				this.cars = response.data;

                for (var i = 0; i < this.cars.length; i++) {
                    var car = this.cars[i];
                    car.driver = this.findUserForId(car.driverId);
                    var riders = [];
                    for (var j = 0; j < car.riderIds.length; j++) {
                        riders.push(this.findUserForId(car.riderIds[j]));
                    }
                    car.riders = riders;
                }

			}, (error) => {

			});
		}

        findUserForId(id) {
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i]._id === id) {
                    return this.users[i];
                }
            }
            // // user not found
            // console.log('Error: user not found in function ctr.findUserForId(id)');
        }


        deleteUserFromCar(carIndex) {

        }
	}

	angular.module('gimpalApp.admin')
		.controller('AdminController', AdminController);

})();
