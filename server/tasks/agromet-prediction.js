const request         = require('request')
const rp              = require('request-promise')
const moment          = require('moment')
const mongoose        = require('mongoose')
const AgrometStation  = mongoose.model('AgrometStation')
const AgrometSensorData = mongoose.model('AgrometSensorData')
const fs             = require('fs');
const path           = require('path');

const Json2csvParser = require('json2csv').Parser
const fields = [
  {
    label : 'Fecha Hora',
    value : 'date'
  },
  {
    label : 'temperatura',
    value : 'temperature'
  },
  {
    label : 'precipitacion',
    value : 'rain'
  },
  {
    label : 'humedad',
    value : 'relativeHumidity'
  },
  {
    label : 'presion',
    value : 'pressure'
  },
  {
    label : 'radiacion_solar',
    value : 'solarRadiation'
  },
  {
    label : 'vel_viento',
    value : 'windSpeed'
  },
  {
    label : 'temp_minima',
    value : 'temperatureMin'
  },
  {
    label : 'temp_maxima',
    value : 'temperatureMax'
  },
  {
    label : 'dir_viento',
    value : 'windDirection'
  }
]
const json2csvParser = new Json2csvParser({ fields })

task = async () => {
  console.log('====== Iniciando generación de predicciones para estaciones Agromet ======')
  let stations = await AgrometStation.find()
  let from = moment().subtract(1, 'days').startOf('day').toDate()
  let to   = moment().toDate()
  for (let station of stations) {
    _taskLog(station.name, 'Inicio de predicciones.')
    // Obtener mediciones
    let measurements = await AgrometSensorData.find({
      station: station._id,
      date: {
        $gte : from,
        $lt  : to
      }
    })
    measurements = JSON.parse(JSON.stringify(measurements))

    // Generar archivo temporal
    let filename = station._id + '-' + moment(to).format('YYYY-MM-DD') + '.csv'
    measurements.forEach(item => {
      item.date = moment(item.date).format('YYYY-MM-DD HH:mm')
    })
    const csv = json2csvParser.parse(measurements)
    fs.writeFileSync('./data-files/' + filename, csv)
    _taskLog(station.name, 'Archivo de mediciones creado: ' + './data-files/'+filename)

    // TODO: Ejecutar Script sobre archivo

    // TODO: Guardar predicción

    // Eliminar archivo creado
    _removeFile(filename)
    _taskLog(station.name, 'Se eliminó el archivo: ' + filename)
  }
}

_taskLog = (station, message) => {
  console.log('[ Predicción '+ station + ' - ' + (new Date()).toISOString() + '] ' + message)
}

_removeFile = (filename) => {
  if (fs.existsSync('./data-files/'+filename)) {
    fs.unlinkSync('./data-files/'+filename)
  }
}

module.exports = task
