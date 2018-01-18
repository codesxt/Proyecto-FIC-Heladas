var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var hoboStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
mongoose.model('HoboStation', hoboStationSchema, 'hobostation');
