const request         = require('request')
const rp              = require('request-promise')
const moment          = require('moment')
const mongoose        = require('mongoose')
const AgrometStation  = mongoose.model('AgrometStation')
const AgrometSensorData = mongoose.model('AgrometSensorData')

task = async () => {
  console.log('====== Iniciando respaldo automatizado de estaciones Agromet ======')
  let stations = await AgrometStation.find({settings:{autobackup:true}})
  let from = moment().subtract(1, 'days').format('YYYY-MM-DD')
  let to   = moment().format('YYYY-MM-DD')
  for (let station of stations) {
    _taskLog(station.name, 'Inicio de respaldo.')
    let query = 'http://localhost:3000/api/v1/agromet/history/' +
                station.station.id +
                '?from=' + from +
                '&to=' + to
    let data, storeResult
    try {
      data = await rp.get(query)
      _taskLog(station.name, 'Datos obtenidos de Agromet.cl.')
    } catch (error) {
      _taskLog(station.name, 'Error al consultar los datos de Agromet.')
      console.log(error)
    }

    try {
      data = JSON.parse(data)
      _taskLog(station.name, 'Datos leídos de la consulta.')
    } catch (error) {
      _taskLog(station.name, 'Error al parsear los resultados de la consulta.')
      console.log(error)
    }

    let measurements = _filterEmptyRows(data.data)
    _taskLog(station.name, 'Datos nulos filtrados')
    _taskLog(station.name, measurements.length + ' datos leídos')

    try {
      storeResult = await _storeMeasurements(station._id, measurements)
    } catch (error) {
      _taskLog(station.name, 'Error al guardar los datos en la base de datos.')
    }

    _taskLog(station.name, Math.max(storeResult.nMatched, storeResult.nUpserted) + ' datos guardados en la base de datos.')
  }
}

_filterEmptyRows = (data) => {
  let result = []
  data.forEach((item) => {
    if(!(
      item.airTemperatureAvg    == '' &&
      item.hourlyRainfall       == '' &&
      item.relativeHumidityAvg  == '' &&
      item.atmosphericPressure  == '' &&
      item.solarRadiationMax    == '' &&
      item.windSpeedMax         == '' &&
      item.temperatureMin       == '' &&
      item.temperatureMax       == '' &&
      item.windDirection        == '' &&
      item.degreeDay            == '' &&
      item.coldHours            == ''
    )){
      result.push(item);
    }
  })
  return result
}

_storeMeasurements = async (stationId, measurements) => {
  let bulkOp = AgrometSensorData.collection.initializeOrderedBulkOp();
  measurements.forEach((item) => {
    bulkOp.find({
      station : mongoose.Types.ObjectId(stationId),
      date    : new Date(item.date)
    })
    .upsert()
    .update({
      $set : {
        date                : new Date(item.date),
        airTemperatureAvg   : item.airTemperatureAvg,
        hourlyRainfall      : item.hourlyRainfall,
        relativeHumidityAvg : item.relativeHumidityAvg,
        atmosphericPressure : item.atmosphericPressure,
        solarRadiationMax   : item.solarRadiationMax,
        windSpeedMax        : item.windSpeedMax,
        temperatureMin      : item.temperatureMin,
        temperatureMax      : item.temperatureMax,
        windDirection       : item.windDirection,
        degreeDay           : item.degreeDay,
        coldHours           : item.coldHours
      }
    })
  })
  return bulkOp.execute()
}

_taskLog = (station, message) => {
  console.log('[ Respaldo '+ station + ' - ' + (new Date()).toISOString() + '] ' + message)
}

module.exports = task
