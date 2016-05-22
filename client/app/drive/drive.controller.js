'use strict';
(function() {

	class DriveComponent {

        POLL_TIME_MILLIS = 5000;

		constructor($scope, $http, Auth) {

			this.$http = $http;

			this.userIsDriver = false;
			this.me = Auth.getCurrentUser();
            console.log(this.me._id);
			this.myCarId;
            this.myCar;
            this.carRiders = [];
            this.driverInfo;
			this.loaded = false;
            this.lastUpdated = (new Date()).getTime(); // for displaying the time

			this.getUsers();
			this.getCars();

            this.usersPoll = setInterval(this.getUsers.bind(this), this.POLL_TIME_MILLIS);
            this.carsPoll = setInterval(this.getCars.bind(this), this.POLL_TIME_MILLIS);

            $scope.$on('$destroy', () => {
                if (this.usersPoll) {
                    clearInterval(this.usersPoll);
                }
                if (this.carsPoll) {
                    clearInterval(this.carsPoll);
                }
            });

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
				var cars = response.data;
                console.log(cars);
				if (cars.length === 0) { // if there are no cars we can't be in any car
					this.myCarId = null;
					this.userIsDriver = false;
				}

				for (var i = 0; i < cars.length; i++) {

					var car = cars[i];
					if (car.active) { // only process "inactive" cars (cars currently on the road)
						continue;
					}

					//check if I am a driver
					if (car.driverId === this.me._id) {
						this.myCarId = car._id;
                        this.myCar = car;
						this.userIsDriver = true;

                        var riders = [];
                        for (var i = 0; i < car.riderIds.length; i++) {
                            riders.push(this.findUserForId(car.riderIds[i]));
                        }
                        this.carRiders = riders;

						return;
					}
					this.userIsDriver = false; // I am not a driver

					//check if I am a rider
					for (var j = 0; j < car.riderIds.length; j++) {
						var riderId = car.riderIds[j];
						if (this.me._id === riderId) {
							this.myCarId = car._id;
                            this.myCar = car;
                            this.driverInfo = this.findUserForId(car.driverId);
                            console.log('i am a rider');
							return;
						}
					}

					this.myCarId = null; // I am not a rider
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

	}

	angular.module('gimpalApp')
		.component('drive', {
			templateUrl: 'app/drive/drive.html',
			controller: DriveComponent,
			controllerAs: 'ctr'
		});

})();
