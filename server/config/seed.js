/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Car from '../api/car/car.model';

Thing.find({}).remove()
  .then(() => {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
        'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
        'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
        'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
        'tests alongside code. Automatic injection of scripts and ' +
        'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
        'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
        'payload, minifies your scripts/css/images, and rewrites asset ' +
        'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
        'and openshift subgenerators'
    });
  });

User.find({}).remove()
  .then(() => {
    User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@example.com',
        password: 'test',
        address: '123 Real Way',
        phone: '123-123-1234'
      }, {
        provider: 'local',
        role: 'admin',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin',
        address: '456 Sunny Lane',
        phone: '123-456-3434'
      }, {
        provider: 'local',
        name: 'Kevin Wang',
        email: 'weixiang@ualberta.ca',
        password: 'kevin',
        address: '4522 Mead Court',
        phone: '123-456-3434'
      }, {
        provider: 'local',
        name: 'Tony Qian',
        email: 'tony@ualberta.ca',
        password: 'tony',
        address: '1011 Goodwin Cres',
        phone: '123-456-3434'
      }, {
        provider: 'local',
        name: 'Kasun M',
        email: 'kasun@ualberta.ca',
        password: 'kasun',
        address: '12 Hash Drive',
        phone: '323-456-3424'
      })
      .then(() => {
        console.log('finished populating users');
      })
      .then(() => {
          var sampleDriverId = User.find({
              name: 'Kasun M'
            })
            .exec().then(user => {
                seedCars(user);
            });
      });
  });

function seedCars(user) {
    console.log(user[0]._id);
    Car.find({}).remove()
      .then(() => {
        Car.create({
            driverId:user[0]._id,
            active: true,
            riderIds: [],
            seats: 5,
            organization: 'E3C',
            departTime: (new Date()).getTime(),
            comments: ''
          })
          .then(() => {
            console.log('finished populating cars');
          });
      });
  }
