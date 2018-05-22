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

module.exports.getEmaHistory = (req, res) => {
  let emaId = req.params.emaId;
  if(!emaId){
    utils.sendJSONresponse(res, 400, {
      message: "EMA no especificada."
    });
  }
  if(moment(req.query.from).isValid()){
    let from  = moment(req.query.from);
    let to    = req.query.to;

    if(to){
      to = moment(to).add(1, 'day').subtract(1, 'minute');
    }else{
      to = from.clone().add(1, 'day').subtract(1, 'minute');
    }

    if(to.isValid() && to.isAfter(from)){
      // Hacer todo
      let formData = {
        ema_ia_id : emaId,
        dateFrom  : from.format('YYYY-MM-DD HH:mm:ss'),
        dateTo    : to.format('YYYY-MM-DD HH:mm:ss')
      }
      request.post('https://www.agromet.cl/ext/aux/getGraphData.php',
        {
          form: formData
        },
        (error, response, body) => {
          if(error){
            console.log(error);
            utils.sendJSONresponse(res, 404, {
              message: "EMA not found."
            });
            return;
          }else{
            parseString(body, function (err, result) {
              if(err){
                console.log(err);
                console.log("Error parsing body:");
                console.log(body);
                utils.sendJSONresponse(res, 404, {
                  message: "Ocurrió un error al procesar los datos de Agromet."
                });
                return;
              }
              if(!result){
                utils.sendJSONresponse(res, 404, {
                  message: "Ocurrió un error al procesar los datos de Agromet."
                });
                return;
              }
              data = {};
              // Obtener unidades del resultado
              let units = [];
              for(let u of result.estacion.eje){
                units.push(u.split("|").pop());
              }

              // Obtener Etiquetas de los resultados
              let labels = [];
              for(let l of result.estacion.gra){
                labels.push(l.split("|")[1]);
              }

              // Obtener datos
              let measurements = [];
              for(let d of result.estacion.dato){
                //labels.push(d.split("|")[1]);
                let spl = d.split("|");
                // Se asume que la fecha está en zona horaria local.
                // Si estuviera en UTC sería moment.utc()
                measurements.push({
                  date                : moment(spl[1]),
                  airTemperatureAvg   : spl[3],
                  hourlyRainfall      : spl[5],
                  relativeHumidityAvg : spl[7],
                  atmosphericPressure : spl[9],
                  solarRadiationMax   : spl[11],
                  windSpeedMax        : spl[13],
                  temperatureMin      : spl[15],
                  temperatureMax      : spl[17],
                  windDirection       : spl[19],
                  degreeDay           : spl[21],
                  coldHours           : spl[23]
                })
              }

              data.idEMA  = result.estacion.$.id;
              data.data   = measurements;
              data.units  = units;
              data.labels = labels;
              data.from   = from;
              data.to     = to;
              utils.sendJSONresponse(res, 200, data);
              return;
            });
          }
        }
      )
    }else{
      utils.sendJSONresponse(res, 400, {
        message : "Error en el formato de la fecha de término."
      });
      return;
    }
  }else{
    utils.sendJSONresponse(res, 400, {
      message : "Error en el formato de la fecha de inicio."
    });
    return;
  }
}

module.exports.getVariables = (req, res) => {
  request.get('https://www.agromet.cl/ext/aux/getTiposVariables.php',
    (error, response, body) => {
      if(error){
        console.log(error);
        utils.sendJSONresponse(res, 404, {
          message: "Variables not found."
        });
        return;
      }else{
        try {
          body = JSON.parse(body);
        } catch(e) {
          utils.sendJSONresponse(res, 503, {
            message: 'No se pudieron obtener los datos de Agromet. Intente más tarde.'
          })
          return;
        }
        let variables = [];
        for(let v of body){
          variables.push({
            variable : v[0],
            name     : v[1]
          })
        }
        utils.sendJSONresponse(res, 200, {
          variables: variables
        })
      }
    }
  )
}

module.exports.getRegions = (req, res) => {
  request.get('https://www.agromet.cl/ext/aux/getRegiones.php',
    (error, response, body) => {
      if(error){
        console.log(error);
        utils.sendJSONresponse(res, 404, {
          message: "Variables not found."
        });
        return;
      }else{
        try {
          body = JSON.parse(body);
        } catch(e) {
          utils.sendJSONresponse(res, 503, {
            message: 'No se pudieron obtener los datos de Agromet. Intente más tarde.'
          })
          return;
        }
        let regions = [];
        for(let v of body){
          regions.push({
            id    : v[0],
            name  : v[1]
          })
        }
        utils.sendJSONresponse(res, 200, {
          regions: regions
        })
      }
    }
  )
}

module.exports.getCities = (req, res) => {
  let regionId = req.query.region;
  if(!regionId){
    utils.sendJSONresponse(res, 400, {
      message: "Expresión mal formada. Se debe especificar el id de la región."
    });
    return;
  }
  request.get('https://www.agromet.cl/ext/aux/getComunasRegion.php?reg_ia_id='+regionId,
    (error, response, body) => {
      if(error){
        console.log(error);
        utils.sendJSONresponse(res, 404, {
          message: "Variables not found."
        });
        return;
      }else{
        try {
          body = JSON.parse(body);
        } catch(e) {
          utils.sendJSONresponse(res, 503, {
            message: 'No se pudieron obtener los datos de Agromet. Intente más tarde.'
          })
          return;
        }
        let cities = [];
        for(let v of body){
          cities.push({
            id    : v[0],
            name  : v[1]
          })
        }
        utils.sendJSONresponse(res, 200, {
          cities: cities
        })
      }
    }
  )
}

module.exports.getFilteredEMAs = (req, res) => {
  let regionId = req.query.region;
  if(!regionId){
    utils.sendJSONresponse(res, 400, {
      message: "Expresión mal formada. Se debe especificar el id de la región."
    });
    return;
  }
  let url = 'https://www.agromet.cl/ext/aux/getFilteredEMAS.php?';
  url += 'reg_ia_id='+regionId;
  let cityId = req.query.city;
  if(cityId){
    url += '&com_ia_id=' + cityId;
  }
  request.get(url,
    (error, response, body) => {
      if(error){
        console.log(error);
        utils.sendJSONresponse(res, 404, {
          message: "Variables not found."
        });
        return;
      }else{
        try {
          body = JSON.parse(body);
        } catch(e) {
          utils.sendJSONresponse(res, 503, {
            message: 'No se pudieron obtener los datos de Agromet. Intente más tarde.'
          })
          return;
        }
        let emas = [];
        for(let v of body){
          emas.push({
            id    : v[0],
            name  : v[1]
          })
        }
        utils.sendJSONresponse(res, 200, {
          stations: emas
        })
      }
    }
  )
}

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

module.exports.getAgrometStation = (req, res) => {
  AgrometStation.findById(req.params.id, (err, station) => {
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
        station.name = req.body.name;
        station.settings = req.body.settings;
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
  ], (error, result) => {
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
  })
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
}
