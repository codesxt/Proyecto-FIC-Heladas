const mongoose = require('mongoose')
const utils = require('./utils')
const User = mongoose.model('User')
const AgrometStation = mongoose.model('AgrometStation')
const rp = require('request-promise')

module.exports.getStatistics = async (req, res) => {
  let stationsCount = await AgrometStation.count()
  let publicStationsCount = await AgrometStation.count({ public: true })
  let usersCount = await User.count()
  let statistics = {
    stations: stationsCount,
    publicStations: publicStationsCount,
    users: usersCount
  }
  utils.sendJSONresponse(res, 200, statistics)
}
