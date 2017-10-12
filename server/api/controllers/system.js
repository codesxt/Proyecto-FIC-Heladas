const mongoose = require('mongoose');
const validator = require('validator');
const utils = require('./utils');
const Station = mongoose.model('Station');
const User = mongoose.model('User');
const request = require('request');

const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getStatistics = (req, res) => {
  let statistics = {};
  Station.count({}, (err, count) => {
    statistics.stations = count;
    Station.count({
      public: true
    }, (err, count) => {
      statistics.publicStations = count;
      User.count({}, (err, count) => {
        statistics.users = count;
        utils.sendJSONresponse(res, 200, statistics)
        return;
      })
    })
  })
}
