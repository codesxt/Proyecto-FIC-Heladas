var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var agrometStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  station: {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    }
  },
  region: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  city: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  settings: {
    autobackup: {
      type: Boolean,
      required: true,
      default: false
    }
  }
}, {
  timestamps: true
});
mongoose.model('AgrometStation', agrometStationSchema, 'agrometstation');
