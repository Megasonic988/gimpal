/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/cars              ->  index
 * POST    /api/cars              ->  create
 * GET     /api/cars/:id          ->  show
 * PUT     /api/cars/:id          ->  update
 * DELETE  /api/cars/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Car from './car.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates, res) {
  return function(entity) {
    var updated = _.assign(entity, updates);
    console.log(updated);
    if (updated.riderIds) {
        updated.markModified('riderIds'); //MONGOOSE CANNOT DETECT CHANGES IN ARRAY, MUST FORCE "MARKMODIFIED"
        console.log(updated.riderIds.length);
        if (updated.riderIds.length > updated.seats) {
            return res.status(500).json({error: 'No seats left in car'});
        }
    }
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Cars
export function index(req, res) {
  return Car.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Car from the DB
export function show(req, res) {
  return Car.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Car in the DB
export function create(req, res) {
  return Car.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Car in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Car.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body, res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Car from the DB
export function destroy(req, res) {
  return Car.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
