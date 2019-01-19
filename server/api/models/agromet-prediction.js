let mongoose = require('mongoose')
let ObjectId = mongoose.Schema.ObjectId

let agrometPredictionSchema = new mongoose.Schema({
  station: {
    type: mongoose.Schema.ObjectId,
    ref: 'AgrometStation'
  },
  date: {
    type : Date,
    required : true
  },
  frost: {
    type : Boolean,
    required : true
  }
}, {
  timestamps: true
})

agrometPredictionSchema.index({
  station : 1,
  date    : 1
}, {
  unique  : true
})

mongoose.model('AgrometPrediction', agrometPredictionSchema)
