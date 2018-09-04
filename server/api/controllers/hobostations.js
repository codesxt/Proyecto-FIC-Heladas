const multer      = require('multer');
const parse       = require('csv-parse');
const moment      = require('moment');
const mongoose    = require('mongoose');
const HoboData    = mongoose.model('HoboData');
const HoboStation = mongoose.model('HoboStation');
const utils       = require('./utils');

const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage
}).single('file');

module.exports.createStation = (req, res) => {
  var station = new HoboStation();
  station.name        = req.body.name;
  station.displayName = req.body.displayName;
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
      //query.public = true;
    }
  }else{
    // Si el usuario no está autenticado, sólo puede ver las estaciones públicas
    //query.public = true;
  }
  HoboStation.find(
    query
    ,
    '_id name displayName',
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
        HoboStation.count(query, (err, count) => {
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

module.exports.readStation = (req, res) => {
  HoboStation.findById(req.params.id, (err, station) => {
    if(err){
      console.log(err);
      utils.sendJSONresponse(res, 400, err);
    }else{
      var resObject = {
        type: "stations",
        id: station._id,
        attributes: {
          name: station.name,
          displayName: station.displayName
        },
        links: {
          self: req.headers.host+'/api/v1/hobostations/'+station._id
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
  HoboStation.findById(req.params.id)
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
        station.displayName = req.body.displayName;
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
    HoboStation.findByIdAndRemove(req.params.id)
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

module.exports.uploadFile = (req, res) => {
  upload(req, res, (err) => {
      if(err){
        utils.sendJSONresponse(res, 400, {
          message:"Ocurrió un error al subir el archivo.",
          error  : err
        });
        return;
      }else{
        parse(
          req.file.buffer.toString(),
          {
            delimiter : ","
          },
          (error, output) => {
            if(error){
              utils.sendJSONresponse(res, 400, {
                message:"Ocurrió un error al subir el archivo.",
                error  : error
              });
              return;
            }else{
              // Características del archivo
              // * La primera línea trae las etiquetas
              // * Las siguientes líneas tienen las mediciones
              // * Las variables sin mediciones tienen el valor ''
              let labels  = [];
              let documents = [];
              let station = req.body.station;
              if(output.length>=1){
                labels = output[0];
              }
              for(let i=1;i<output.length;i++){
                // Revisar si la fila es válida y añadirla
                if( output[i][2]!=''&&
                    output[i][3]!=''&&
                    output[i][4]!=''&&
                    output[i][5]!=''&&
                    output[i][6]!=''&&
                    output[i][7]!=''&&
                    output[i][8]!=''&&
                    output[i][9]!=''&&
                    output[i][10]!=''){
                  let doc = {
                    station        : station,
                    date           : moment(output[i][1], 'MM/DD/YY HH:mm:ss').toDate(),
                    pressure       : output[i][2],
                    rain           : output[i][3],
                    temperature    : output[i][4],
                    rh             : output[i][5],
                    dewPoint       : output[i][6],
                    solarRadiation : output[i][7],
                    windDirection  : output[i][8],
                    windSpeed      : output[i][9],
                    gustSpeed      : output[i][10],
                    battery        : output[i][11]
                  }
                  documents.push(doc);
                }
              }
              /*
              console.log("Station: " + station);
              console.log("Labels:");
              console.log(labels);
              console.log("Documents:");
              console.log(documents);
              */
              let bulkOp = HoboData.collection.initializeOrderedBulkOp();
              documents.forEach((item) => {
                bulkOp.find({
                  station         : station,
                  date            : item.date
                })
                .upsert()
                .update({
                  $set : {
                    station        : station,
                    date           : item.date,
                    pressure       : item.pressure,
                    rain           : item.rain,
                    temperature    : item.temperature,
                    rh             : item.rh,
                    dewPoint       : item.dewPoint,
                    solarRadiation : item.solarRadiation,
                    windDirection  : item.windDirection,
                    windSpeed      : item.windSpeed,
                    gustSpeed      : item.gustSpeed,
                    battery        : item.battery

                  }
                })
              })
              bulkOp.execute((error, result) => {
                if(error){
                  console.log(JSON.stringify(error, null, "\t"));
                  utils.sendJSONresponse(res, 400, {
                    message: "Se ha producido un error en la inserción de los datos. Probablemente se hayan subido datos que ya estaban en el sistema."
                  });
                  return;
                }else{
                  utils.sendJSONresponse(res, 201, {
                    message   : "Inserción exitosa de datos.",
                    nInserted : Math.max(result.toJSON().nUpserted, result.toJSON().nMatched)
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

module.exports.getSensorDataByDate = (req, res) => {
  let station = req.params.station;
  let query = {
    station  : station
  }

  if(req.query.from && !req.query.to){
    let fromData = moment(req.query.from, 'YYYY-MM-DD').toDate();
    let toDate   = moment(req.query.from, 'YYYY-MM-DD').add(1, 'day').toDate();
    query.date = {
      $gte : fromData,
      $lt  : toDate
    }
  }
  if(req.query.from && req.query.to){
    let fromData = moment(req.query.from, 'YYYY-MM-DD').toDate();
    let toDate   = moment(req.query.to, 'YYYY-MM-DD').add(1, 'day').toDate();
    query.date = {
      $gte : fromData,
      $lt  : toDate
    }
  }
  HoboData.aggregate([
    {
      $match: query
    },
    {
      $sort:{
        date: 1
      }
    }
  ], (err, result) => {
    if (err) {
      console.log(err);
      utils.sendJSONresponse(res, 404, err);
      return;
    }else {
      utils.sendJSONresponse(res, 200, result);
    }
  })
}
