'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var CarSchema = new mongoose.Schema({
  driverId: Schema.Types.ObjectId,
  riderIds: [Schema.Types.ObjectId],
  active: Boolean,
  seats: Number,
  organization: String,
  departTime: Date,
  comments: String
});

export default mongoose.model('Car', CarSchema);
