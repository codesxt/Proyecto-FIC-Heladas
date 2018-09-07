var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var miniStationDataSchema = new mongoose.Schema({
  node: {
    type : ObjectId,
    ref  : 'ControllerNode',
    required : true
  },
  station: {
    type : ObjectId,
    ref  : 'ControllerNode.stations',
    required : true
  },
  date: {
    type: Date,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  radiation: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

miniStationDataSchema.index({
  node    : 1,
  station : 1,
  date    : 1
}, {
  unique: true
});
mongoose.model('MiniStationData', miniStationDataSchema, 'ministationdata');
