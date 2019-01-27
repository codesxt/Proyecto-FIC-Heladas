const agrometBackupTask = require('./agromet-backup')
const agrometPredictionTask = require('./agromet-prediction')
const notificationsTask = require('./notifications')

module.exports = {
  agrometBackupTask,
  agrometPredictionTask,
  notificationsTask
}
