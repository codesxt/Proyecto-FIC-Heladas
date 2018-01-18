const mongoose = require('mongoose');
const validator = require('validator');
const utils = require('./utils');
const Station = mongoose.model('Station');
const request = require('request');

const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.createStation = (req, res) => {
  var station = new Station();
  station.name = req.body.name;
  station.public = req.body.public;
  station.idEMA = req.body.ema;
  station.public = req.body.public;
  station.location = {
    type: "Point",
    coordinates: [
      +req.body.lng,
      +req.body.lat
    ]
  }
  station.save((err) => {
    if(err){
      utils.sendJSONresponse(res, 400, {
        message: "La estación no pudo ser creada.",
        err: err
      });
      return;
    }
    utils.sendJSONresponse(res, 200, {
      message: "Estación Creada Exitosamente."
    })
    return;
  })
}

module.exports.readStationList = (req, res) => {
  var hostname    = req.headers.host;
  let requestData = JsonApiQueryParser.parseRequest(req.url);
  let pageNumber  = requestData.queryData.page.number  || 0;
  let pageSize    = requestData.queryData.page.size    || 10;
  let query = { };
  if(req.user){
    // Si el usuario no es administrador, sólo puede ver las estaciones públicas
    if(req.user.role!='administrator'){
      query.public = true;
    }
  }else{
    // Si el usuario no está autenticado, sólo puede ver las estaciones públicas
    query.public = true;
  }
  Station.find(
    query
    ,
    '_id name idEMA public location',
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
        Station.count(query, (err, count) => {
          utils.sendJSONresponse(res, 201, {
            meta: {
              "total-pages": count/pageSize,
              "total-items": count
            },
            links: {
              self: hostname+'/api/v1/stations'
            },
            data: stations
          });
        });
      }
    }
  );
}

module.exports.readStation = (req, res) => {
  Station.findById(req.params.id, (err, station) => {
    if(err){
      console.log(err);
      utils.sendJSONresponse(res, 400, err);
    }else{
      var resObject = {
        type: "stations",
        id: station._id,
        attributes: {
          name: station.name,
          idEMA: station.idEMA,
          public: station.public,
          location: station.location
        },
        links: {
          self: req.headers.host+'/api/v1/stations/'+station._id
        }
      };
      utils.sendJSONresponse(res, 200, resObject);
    }
  });
}

module.exports.updateStation = (req, res) => {
  if (!req.params.id) {
    utils.sendJSONresponse(res, 404, {
      "message": "Estación no encontrada. Se requiere especificar un ID."
    });
    return;
  }
  Station.findById(req.params.id)
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
        station.idEMA = req.body.ema;
        station.public = req.body.public;
        station.location = {
          type: "Point",
          coordinates: [
            +req.body.lng,
            +req.body.lat
          ]
        }
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

module.exports.deleteStation = (req, res) => {
  // Add verification if user is owner of the document
  if(req.params.id){
    Station.findByIdAndRemove(req.params.id)
    .exec(
      function(err, station){
        if(err){
          utils.sendJSONresponse(res, 404, err);
          return;
        }
        utils.sendJSONresponse(res, 204, null);
        return;
      }
    )
  }else{
    sendJSONresponse(res, 404, {
      "message": "No se encontró la estación."
    })
    return;
  }
}

module.exports.readStationDayPrediction = (req, res) => {
  var hostname    = req.headers.host;
  if(req.params.id){
    Station.findById(req.params.id)
    .exec((err, station) => {
      if(err){
        utils.sendJSONresponse(res, 404, err);
        return;
      }else{
        let emaId = station.idEMA;
        request.post('https://heladas.utalca.cl/heladas/consulta/index.php?id_est='+emaId,
          (error, response, body) => {
            if(error){
              console.log(error);
              utils.sendJSONresponse(res, 404, {
                message: "EMA List not found."
              });
              return;
            }else{
              body = JSON.parse(body);
              let prediction = {
                emaId: emaId,
                stationId: req.params.id,
                station: station.name,
                date: body.fecha_pred,
                time: body.horario_prediccion
              };
              if(body.nom_estado=="n"){
                prediction.frost = false;
              }else if(body.nom_estado=="y"){
                prediction.frost = true;
              }else{
                prediction.frost = null;
              }
              utils.sendJSONresponse(res, 200, {
                links: {
                  self: hostname+'/api/v1/day-prediction/'+req.params.id
                },
                data: prediction
              })
              return;
            }
          }
        );
      }
    });
  }else{
    sendJSONresponse(res, 404, {
      "message": "No se encontró la estación."
    })
    return;
  }
}

module.exports.readStationDayBeforePrediction = (req, res) => {
  var hostname    = req.headers.host;
  if(req.params.id){
    Station.findById(req.params.id)
    .exec((err, station) => {
      if(err){
        utils.sendJSONresponse(res, 404, err);
        return;
      }else{
        let emaId = station.idEMA;
        request.post('https://heladas.utalca.cl/heladas/consulta/index_dia_anterior.php?id_est='+emaId,
          (error, response, body) => {
            if(error){
              console.log(error);
              utils.sendJSONresponse(res, 404, {
                message: "EMA List not found."
              });
              return;
            }else{
              body = JSON.parse(body);
              let prediction = {
                emaId: emaId,
                stationId: req.params.id,
                station: station.name,
                date: body.fecha_pred,
                time: body.horario_prediccion
              };
              if(body.nom_estado=="n"){
                prediction.frost = false;
              }else if(body.nom_estado=="y"){
                prediction.frost = true;
              }else{
                prediction.frost = null;
              }
              utils.sendJSONresponse(res, 200, {
                links: {
                  self: hostname+'/api/v1/day-before-prediction/'+req.params.id
                },
                data: prediction
              })
              return;
            }
          }
        );
      }
    });
  }else{
    sendJSONresponse(res, 404, {
      "message": "No se encontró la estación."
    })
    return;
  }
}

mixArrays = (history15, history18, history21) => {
  let newArray = history15.map(
    item => {
      let p18 = history18.filter(
        otherItem => {
          return otherItem.date === item.date
        }
      )[0];
      let pred18 = (p18) ? p18.prediction : 'null';
      let p21 = history21.filter(
        otherItem => {
          return otherItem.date === item.date
        }
      )[0];
      let pred21 = (p21) ? p21.prediction : 'null';
      return {
        date   : item.date,
        pred15 : item.prediction,
        pred18 : pred18,
        pred21 : pred21
      }
    }
  )
  return newArray;
}

parsePrediction = (value) => {
  if(value=='n') return false;
  if(value=='y') return true;
  if(value=='sd') return null;
  return null;
}

module.exports.getPredictionsHistory = (req, res) => {
  var hostname    = req.headers.host;
  var year        = req.query.year || new Date().getFullYear();
  var month       = req.query.month || new Date().getMonth()+1;
  if(req.params.id){
    Station.findById(req.params.id)
    .exec((err, station) => {
      if(err){
        utils.sendJSONresponse(res, 404, err);
        return;
      }else{
        // Aquí pasa la magia
        let emaId = station.idEMA;
        let history15 = [];
        let history18 = [];
        let history21 = [];
        request.post('https://heladas.utalca.cl/heladas//monitor/acciones.php?acc=1'+'&id_est='+emaId+'&id_hor=15'+'&anno='+year+'&mes='+month,
          (error, response, body) => {
            if(error){
              console.log(error);
              utils.sendJSONresponse(res, 404, {
                message: "EMA List not found."
              });
              return;
            }else{
              history15 = JSON.parse(body).data.map(
      					val => {
      						return {
      							date: val.fecha_pred,
      							prediction: parsePrediction(val.nom_estado)
      						}
      					}
      				)
              request.post('https://heladas.utalca.cl/heladas//monitor/acciones.php?acc=1'+'&id_est='+emaId+'&id_hor=18'+'&anno='+year+'&mes='+month,
                (error, response, body) => {
                  if(error){
                    console.log(error);
                    utils.sendJSONresponse(res, 404, {
                      message: "EMA List not found."
                    });
                    return;
                  }else{
                    history18 = JSON.parse(body).data.map(
            					val => {
            						return {
            							date: val.fecha_pred,
            							prediction: parsePrediction(val.nom_estado)
            						}
            					}
            				)
                    request.post('https://heladas.utalca.cl/heladas//monitor/acciones.php?acc=1'+'&id_est='+emaId+'&id_hor=21'+'&anno='+year+'&mes='+month,
                      (error, response, body) => {
                        if(error){
                          console.log(error);
                          utils.sendJSONresponse(res, 404, {
                            message: "EMA List not found."
                          });
                          return;
                        }else{
                          history21 = JSON.parse(body).data.map(
                  					val => {
                  						return {
                  							date: val.fecha_pred,
                  							prediction: parsePrediction(val.nom_estado)
                  						}
                  					}
                  				)
                          utils.sendJSONresponse(res, 200, {
                            links: {
                              self: hostname+'/api/v1/predictions-history/'+req.params.id
                            },
                            data: mixArrays(history15, history18, history21)
                          })
                          return;
                        }
                      }
                    )
                  }
                }
              )
            }
          }
        )
      }
    });
  }else{
    utils.sendJSONresponse(res, 404, {
      "message": "No se encontró la estación."
    })
    return;
  }
}
