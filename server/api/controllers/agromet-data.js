const utils = require('./utils');
const request = require('request');
const parseString = require('xml2js').parseString;
const moment = require('moment');
const mongoose    = require('mongoose');
const AgrometStation = mongoose.model('AgrometStation');
const AgrometSensorData = mongoose.model('AgrometSensorData');
const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();
const ObjectId = mongoose.Types.ObjectId;

module.exports.getSensorDataByDate = (req, res) => {
  let station = req.params.id;
  let query = {
    station  : mongoose.Types.ObjectId(station)
  }

  if(req.query.from && !req.query.to){
    let fromData = moment(req.query.from, 'YYYY-MM-DD').toDate();
    let toDate   = moment(req.query.from, 'YYYY-MM-DD').add(1, 'day').toDate();
    query.date = {
      $gte : fromData,
      $lt  : toDate
    }
  }
  if(req.query.from && req.query.to){
    let fromData = moment(req.query.from, 'YYYY-MM-DD').toDate();
    let toDate   = moment(req.query.to, 'YYYY-MM-DD').add(1, 'day').toDate();
    query.date = {
      $gte : fromData,
      $lt  : toDate
    }
  }
  AgrometSensorData.aggregate([
    {
      $match: query
    },
    {
      $sort:{
        date: 1
      }
    }
  ], (err, result) => {
    if (err) {
      console.log(err);
      utils.sendJSONresponse(res, 404, err);
      return;
    }else {
      utils.sendJSONresponse(res, 200, result);
    }
  })
}

module.exports.deleteSensorDataByDate = (req, res) => {
  let station = req.params.id;
  let query = {
    station  : mongoose.Types.ObjectId(station)
  }

  if(req.query.from && !req.query.to){
    let fromData = moment(req.query.from, 'YYYY-MM-DD').toDate();
    let toDate   = moment(req.query.from, 'YYYY-MM-DD').add(1, 'day').toDate();
    query.date = {
      $gte : fromData,
      $lt  : toDate
    }
  }
  if(req.query.from && req.query.to){
    let fromData = moment(req.query.from, 'YYYY-MM-DD').toDate();
    let toDate   = moment(req.query.to, 'YYYY-MM-DD').add(1, 'day').toDate();
    query.date = {
      $gte : fromData,
      $lt  : toDate
    }
  }

  AgrometSensorData.deleteMany(query, (error) => {
    if (error) {
      console.log(error);
      utils.sendJSONresponse(res, 404, error);
      return;
    }else {
      utils.sendJSONresponse(res, 204, null);
    }
  })
}
