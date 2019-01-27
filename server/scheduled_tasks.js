const schedule = require('node-schedule')
const db = require('./api/models/db')
const taskModule = require('./tasks')

module.exports.run = () => {
  console.log("[Task Scheduler] Scheduling Tasks...")

  const agrometPredictionJob15 = schedule.scheduleJob('0 15 * * *', function(fireDate) {
    taskModule.agrometPredictionTask(fireDate, 15)
  })
  const agrometPredictionJob18 = schedule.scheduleJob('0 18 * * *', function(fireDate) {
    taskModule.agrometPredictionTask(fireDate, 18)
  })
  const agrometPredictionJob21 = schedule.scheduleJob('0 21 * * *', function(fireDate) {
    taskModule.agrometPredictionTask(fireDate, 21)
  })
  const agrometBackupJob     = schedule.scheduleJob('0 * * * *', taskModule.agrometBackupTask)

  const notificationsJob     = schedule.scheduleJob('5 18 * * *', taskModule.notificationsTask)
  console.log("[Task Scheduler] Task Schedule set")
}
