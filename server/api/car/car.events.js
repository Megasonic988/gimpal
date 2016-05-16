/**
 * Car model events
 */

'use strict';

import {EventEmitter} from 'events';
import Car from './car.model';
var CarEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CarEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Car.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    CarEvents.emit(event + ':' + doc._id, doc);
    CarEvents.emit(event, doc);
  }
}

export default CarEvents;
