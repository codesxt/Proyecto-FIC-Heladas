const rp              = require('request-promise')
const mongoose        = require('mongoose')
const AgrometStation  = mongoose.model('AgrometStation')
const AgrometPrediction = mongoose.model('AgrometPrediction')
const User            = mongoose.model('User')
const mailer         = require('../mailer');

const HOST = 'http://localhost:3100'

task = async () => {
  _taskLog('Comenzando proceso de notificación')
    // 1. Obtener todas las Estaciones
  let stations = await AgrometStation.find().lean().exec()
  _taskLog('Lista de estaciones obtenida')
  // 2. Obtener las predicciones de cada estación
  for (let station of stations) {
    let url = HOST + '/api/v1/last-station-prediction/' + station._id
    let prediction = await rp.get(url)
    if ( typeof prediction === 'string' ) prediction = JSON.parse(prediction)
    station.prediction = prediction.frost
  }
  _taskLog('Predicciones de las estaciones obtenidas')
  // 3. Obtener usuarios del Sistema
  let users = await User.find().lean().exec()
  _taskLog('Usuarios obtenidos')
  for (let user of users) {
    // 4. Obtener suscripciones del usuario
    _taskLog('Preparando notificaciones para el usuario: ' + user.name)
    let subscriptions = user.subscriptions.map(item => ''+item)
    if (subscriptions.length > 0) { // Ignorar usuarios sin suscripciones
      let userSubscriptions = stations.filter(station => {
        return subscriptions.indexOf(''+station._id) > -1
      })
      if (user.settings.dailyEmail) {
        // El usuario quiere recibir un reporte diario
        _taskLog('Enviando reporte diario al usuario ' + user.name)
        sendNotifications(user, userSubscriptions)
      } else {
        // El usuario quiere recibir un reporte sólo cuando hayan Heladas
        let frostCount = userSubscriptions.filter(item => item.prediction == true).length
        if ( frostCount > 0 ) {
          _taskLog('Enviando reporte con incidencia de heladas al usuario ' + user.name)
          sendNotifications(user, userSubscriptions)
        } else {
          _taskLog('No hay incidencias, así que no se notifica al usuario ' + user.name)
        }
      }
    } else {
      _taskLog('El usuario ' + user.name + ' no está suscrito a ninguna estación')
    }
  }
  _taskLog('Envío de notificaciones finalizado')
}

sendNotifications = (user, subscriptions) => {
  let frosts = []
  subscriptions.forEach(item => frosts.push({ name: item.name, prediction: item.prediction }))
  mailer.sendFrostsEmail(user.email, frosts)
}

_taskLog = (message) => {
  console.log('[ Notificación ' + (new Date()).toISOString() + '] ' + message)
}

module.exports = task
