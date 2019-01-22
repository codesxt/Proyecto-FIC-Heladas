const mongoose = require('mongoose')
const utils = require('./utils')
const moment = require('moment')
const AgrometPrediction = mongoose.model('AgrometPrediction')

module.exports.getLastStationPrediction = async (req, res) => {
  let prediction = await AgrometPrediction.findOne({
    station: req.params.id
  })
  .sort('-date')
  .populate('station')
  utils.sendJSONresponse(res, 200, prediction)
}

module.exports.getPredictionHistory = async (req, res) => {
  let stationId = req.params.id;
  let toDate   = null;
  let fromDate = null;
  if(req.query.from){
    fromDate = moment(req.query.from).tz('America/Santiago').toDate();
  }else{
    utils.sendJSONresponse(res, 400, {
      message : "La fecha de inicio es obligatoria."
    });
    return;
  }
  if(req.query.to){
    toDate   = moment(req.query.to).tz('America/Santiago').add(1, 'days').toDate();
  }else{
    toDate   = moment(fromDate).add(1, 'days').toDate();
  }
  let predictions = await AgrometPrediction.find({
    station : mongoose.Types.ObjectId(stationId),
    date    : {
      $gte : fromDate,
      $lt : toDate
    }
  })
  utils.sendJSONresponse(res, 200, {
    data: predictions
  })
}
