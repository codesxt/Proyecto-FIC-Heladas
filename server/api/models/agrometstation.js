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
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: Array,
      default: [-71.665842, -35.426707]
    }
  },
  settings: {
    autobackup: {
      type: Boolean,
      required: true,
      default: false
    },
    public: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}, {
  timestamps: true
})

agrometStationSchema.index({ location: '2dsphere' })
mongoose.model('AgrometStation', agrometStationSchema, 'agrometstation');
