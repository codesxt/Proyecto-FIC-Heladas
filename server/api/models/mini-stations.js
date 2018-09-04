var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var miniStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: []
  }
}, {
  timestamps: false
});

var controllerNodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: []
  },
  stations: [
    miniStationSchema
  ]
}, {
  timestamps: true
});

controllerNodeSchema.index({ location: '2dsphere' });
controllerNodeSchema.index({ "stations.location": '2dsphere' });
mongoose.model('ControllerNode', controllerNodeSchema);
