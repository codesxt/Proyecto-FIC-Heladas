/*
const prediction         = require('./prediction');
const sectorPredictions  = require('./sector-predictions');
const stationBackup      = require('./station-backup');
const frostNotifications = require('./frost-notifications');
const sectorMeasurements = require('./sector-measurements');

module.exports = {
  prediction                : prediction.prediction,
  sectorHourlyPrediction    : sectorPredictions.hourlyPrediction,
  stationDataBackup         : stationBackup.stationDataBackup,
  notifyFrosts              : frostNotifications.notifyFrosts,
  measurementInterpolations : sectorMeasurements.measurementInterpolations,
  sectorizedPredictions     : sectorPredictions.sectorizedPredictions
};
*/

const agrometBackupTask = require('./agromet-backup')
const agrometPredictionTask = require('./agromet-prediction')

module.exports = {
  agrometBackupTask,
  agrometPredictionTask
}
