const mongoose = require('mongoose');
const validator = require('validator');
const utils = require('./utils');
const Station = mongoose.model('Station');

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
  let pageSize    = requestData.queryData.page.size    || 0;
  let query = { };
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
