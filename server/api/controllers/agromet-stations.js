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

module.exports.createAgrometStation = (req, res) => {
  let stationData = req.body;
  if(stationData.name && stationData.station && stationData.city && stationData.region && stationData.settings){
    // store
    let station      = new AgrometStation();
    station.name     = stationData.name;
    station.station  = stationData.station;
    station.city     = stationData.city;
    station.region   = stationData.region;
    station.settings = stationData.settings;
    station.location = stationData.location;
    station.save((err, result) => {
      if(err){
        console.log(err);
        utils.sendJSONresponse(res, 500, {
          message: 'Ocurrió un error al registrar la estación. Detalles: ' + err.message
        })
        return;
      }else{
        utils.sendJSONresponse(res, 200, {
          message: 'Estación creada exitosamente.'
        })
      }
    })
  }else{
    utils.sendJSONresponse(res, 400, {
      message: 'Faltan datos en la solicitud.'
    })
  }
}

module.exports.listAgrometStations = (req, res) => {
  var hostname    = req.headers.host;
  let requestData = JsonApiQueryParser.parseRequest(req.url);
  let pageNumber  = requestData.queryData.page.number  || 0;
  let pageSize    = requestData.queryData.page.size    || 10;
  let query = { };
  AgrometStation.find(
    query
    ,
    '',
    {
      sort:{ },
      skip:pageNumber*pageSize,
      limit:pageSize*1
    },
    function(err, stations){
      if(err){
        console.log(err);
        utils.sendJSONresponse(res, 400, err);
      }else{
        //console.log(events);
        AgrometStation.count(query, (err, count) => {
          utils.sendJSONresponse(res, 201, {
            meta: {
              "total-pages": count/pageSize,
              "total-items": count
            },
            links: {
              self: hostname+'/api/v1/hobostations'
            },
            data: stations
          });
        });
      }
    }
  );
}

module.exports.listAgrometPublicStations = (req, res) => {
  var hostname    = req.headers.host;
  let requestData = JsonApiQueryParser.parseRequest(req.url);
  let pageNumber  = requestData.queryData.page.number  || 0;
  let pageSize    = requestData.queryData.page.size    || 10;
  let query = { 'settings.public' : true };
  AgrometStation.find(
    query
    ,
    '',
    {
      sort:{ },
      skip:pageNumber*pageSize,
      limit:pageSize*1
    },
    function(err, stations){
      if(err){
        console.log(err);
        utils.sendJSONresponse(res, 400, err);
      }else{
        //console.log(events);
        AgrometStation.count(query, (err, count) => {
          utils.sendJSONresponse(res, 201, {
            meta: {
              "total-pages": count/pageSize,
              "total-items": count
            },
            links: {
              self: hostname+'/api/v1/hobostations'
            },
            data: stations
          });
        });
      }
    }
  );
}

module.exports.getAgrometStation = (req, res) => {
  AgrometStation.findById(req.params.id)
  .lean()
  .exec((err, station) => {
    if(err){
      console.log(err);
      utils.sendJSONresponse(res, 400, err);
    }else{
      var resObject = {
        type: "agrometstations",
        id: station._id,
        attributes: {
          name     : station.name,
          station  : station.station,
          region   : station.region,
          city     : station.city,
          location : station.location,
          settings : station.settings
        },
        links: {
          self: req.headers.host+'/api/v1/agrometstations/'+station._id
        }
      };
      utils.sendJSONresponse(res, 200, resObject);
    }
  });
}

module.exports.editAgrometStation = (req, res) => {
  if (!req.params.id) {
    utils.sendJSONresponse(res, 404, {
      "message": "Estación no encontrada. Se requiere especificar un ID."
    });
    return;
  }
  AgrometStation.findById(req.params.id)
  .exec(
    (err, station) => {
      if(!station){
        utils.sendJSONresponse(res, 404, {
          "message": "Estación no encontrada."
        });
        return;
      }else if (err) {
        utils.sendJSONresponse(res, 400, {
          message: "Ocurrió un error al actualizar la estación.",
          error: err
        });
        return;
      }else{
        station.name = req.body.name
        station.settings = req.body.settings
        station.location = req.body.location ? req.body.location : { type: 'Point', coordinates: [-71.665842, -35.426707]}
        station.save((err) => {
          if (err){
            utils.sendJSONresponse(res, 400, {
              "message": "Ha ocurrido un error en la actualización de los datos."
            })
            return;
          }else{
            utils.sendJSONresponse(res, 200, {
              "message": "Estación actualizada exitosamente.",
              station: station
            })
            return;
          }
        })
      }
    }
  )
}

module.exports.removeAgrometStation = (req, res) => {
  AgrometStation.findByIdAndRemove(req.params.id)
  .exec(
    function(err, station){
      if(err){
        utils.sendJSONresponse(res, 404, err);
        return;
      }
      AgrometSensorData.remove({
        station: station._id
      }, (error, data) => { })
      utils.sendJSONresponse(res, 204, null);
      return;
    }
  )
}
/*
  Métodos utilizados antiguamente para respaldar los datos de Agromet.
  Actualmente han sido reemplazados por otros métodos, pero su implementación
  puede servir como referencia.

module.exports.backupAgrometData = (req, res) => {
  // 1. Cargar estación
  // 2. Cargar datos de agromet usando id de EMA
  // 3. Upsertar datos de agromet en la bd local
  if(req.route.path=='/agrometdata/auto/:id'){
    // Excepción para asegurar el endpoint que no lleva autenticación
    // y que es llamado desde la tarea de respaldo automatizado
    if(!(req.headers.host == 'localhost:3000' || req.headers.host == 'heladas.utalca.cl')){
      utils.sendJSONresponse(res, 401, {
        message: "No tiene autorización para realizar esta acción."
      });
      return;
    }
  }
  AgrometStation.findOne({
    _id: req.params.id
  })
  .exec(
    (err, station) => {
      if(!station){
        utils.sendJSONresponse(res, 404, {
          "message": "Estación no encontrada."
        });
        return;
      }else if (err) {
        utils.sendJSONresponse(res, 400, {
          message: "Ocurrió un error al buscar la estación.",
          error: err
        });
        return;
      }else{
        //console.log(station);
        let query = 'http://'+req.headers.host+'/api/v1/agromet/history/'+station.station.id+'?from='+req.query.from;
        //console.log(query);
        request.get(query,
          { },
          (error, response, body) => {
            if(error){
              console.log(error);
              utils.sendJSONresponse(res, 404, {
                message: "EMA not found."
              });
              return;
            }else{
              let responseData = JSON.parse(body).data;
              let result = [];
              responseData.forEach((item) => {
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
              if(result.length == 0){
                utils.sendJSONresponse(res, 404, {
                  message: 'No se encontraron datos que guardar en la base de datos.'
                });
                return;
              }
              let bulkOp = AgrometSensorData.collection.initializeOrderedBulkOp();
              result.forEach((item) => {
                bulkOp.find({
                  station : ObjectId(station._id),
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
              bulkOp.execute((error, result) => {
                if(error){
                  utils.sendJSONresponse(res, 500, {
                    message: 'Ocurrió un error al guardar los datos en la base de datos. Detalles: ' + error.toJSON().errmsg
                  });
                  return;
                }else{
                  utils.sendJSONresponse(res, 200, {
                    message : 'Datos de Agromet guardados en la base de datos.',
                    nData   : Math.max(result.toJSON().nUpserted, result.toJSON().nMatched)
                  });
                  return;
                }
              });
            }
          }
        )
      }
    }
  )
}

module.exports.getAgrometDataCount = (req, res) => {
  let stationId = req.params.id;
  let toDate   = null;
  let fromDate = null;
  if(req.query.from){
    fromDate = new Date(req.query.from);
  }else{
    utils.sendJSONresponse(res, 400, {
      message : "La fecha de inicio es obligatoria."
    });
    return;
  }
  if(req.query.to){
    toDate   = moment(new Date(req.query.to)).add(1, 'days').toDate();
  }else{
    toDate   = moment(fromDate).add(1, 'days').toDate();
  }
  AgrometSensorData.aggregate([
    {
      $match: {
        station : ObjectId(stationId),
        date    : {
          $gte : fromDate,
          $lte : toDate
        }
      }
    },
    {
      $group: {
        _id:
        {
            day: { $dayOfMonth: {date:'$date',timezone:'America/Santiago'}},
            month: { $month: {date:'$date',timezone:'America/Santiago'}},
            year: { $year: {date:'$date',timezone:'America/Santiago'}}
        },
        count: { $sum:1 },
        date: { $first: "$date" }
      }
    }
  ])
  .exec(
    (error, result) => {
      if(error){
        utils.sendJSONresponse(res, 500, {
          message : "Ocurrió un error al contar los datos existentes en el sistema.",
          error   : error
        });
        return;
      }else{
        utils.sendJSONresponse(res, 200, {
          data : result
        });
        return;
      }
    }
  )
}

module.exports.removeAgrometData = (req, res) => {
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
  AgrometSensorData.remove({
    station : ObjectId(stationId),
    date    : {
      $gte : fromDate,
      $lt : toDate
    }
  }, (error) => {
    if(error) {
      utils.sendJSONresponse(res, 400, {
        message : "Ocurrió un error al eliminar los datos."
      });
      return;
    }else{
      utils.sendJSONresponse(res, 204, null);
      return;
    }
  })
}*/
