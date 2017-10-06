var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var ObjectId = mongoose.Schema.ObjectId;

var stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  idEMA: {
    type: String,
    required: true
  },
  public: {
    type: Boolean,
    required: true,
    default: true
  },
  location: {
    type: { type: String },
    coordinates: []
  },
}, {
  timestamps: true
});

stationSchema.index({ location: '2dsphere' });
mongoose.model('Station', stationSchema);
