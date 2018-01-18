var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var hoboDataSchema = new mongoose.Schema({
  station: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  pressure: {
    type: Number,
    required: true
  },
  rain: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  rh: {
    type: Number,
    required: true
  },
  dewPoint: {
    type: Number,
    required: true
  },
  solarRadiation: {
    type: Number,
    required: true
  },
  windDirection: {
    type: Number,
    required: true
  },
  windSpeed: {
    type: Number,
    required: true
  },
  gustSpeed: {
    type: Number,
    required: true
  },
  battery: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

hoboDataSchema.index({
  station : 1,
  date    : 1
}, {
  unique: true
});
mongoose.model('HoboData', hoboDataSchema, 'hobodata');
