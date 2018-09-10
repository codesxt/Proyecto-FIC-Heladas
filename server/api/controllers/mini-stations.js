const multer      = require('multer');
const moment      = require('moment');
const mongoose    = require('mongoose');
const ControllerNode = mongoose.model('ControllerNode');
const MiniStationData = mongoose.model('MiniStationData');
const utils       = require('./utils');

const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage
}).single('file');

module.exports.createControllerNode = (req, res) => {
  let controllerNode      = new ControllerNode();
  controllerNode.name     = req.body.name;
  controllerNode.location = req.body.location;
  controllerNode.stations = req.body.stations;
  controllerNode.save((err) => {
    if(err){
      utils.sendJSONresponse(res, 400, {
        message: "El controlador no pudo ser creado.",
        err: err
      });
      return;
    }
    utils.sendJSONresponse(res, 200, {
      message: "Nodo controlador creado exitosamente."
    })
    return;
  })
}

module.exports.getControllerNodes = (req, res) => {
  var hostname    = req.headers.host;
  let requestData = JsonApiQueryParser.parseRequest(req.url);
  let pageNumber  = requestData.queryData.page.number  || 0;
  let pageSize    = requestData.queryData.page.size    || 10;
  let query = { };
  ControllerNode.find(
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
        ControllerNode.count(query, (err, count) => {
          utils.sendJSONresponse(res, 201, {
            meta: {
              "total-pages": count/pageSize,
              "total-items": count
            },
            links: {
              self: hostname+'/api/v1/controller-nodes'
            },
            data: stations
          });
        });
      }
    }
  );
}

module.exports.readControllerNode = (req, res) => {
  ControllerNode.findById(req.params.id, (err, controllerNode) => {
    if(err){
      console.log(err);
      utils.sendJSONresponse(res, 400, err);
    }else{
      var resObject = {
        type: "controller-node",
        id: controllerNode._id,
        attributes: controllerNode,
        links: {
          self: req.headers.host+'/api/v1/controller-nodes/'+controllerNode._id
        }
      };
      utils.sendJSONresponse(res, 200, resObject);
    }
  });
}

module.exports.updateControllerNode = (req, res) => {
  if (!req.params.id){
    utils.sendJSONresponse(res, 404, {
      "message": "Estación no encontrada. Se requiere especificar un ID."
    });
    return;
  }
  ControllerNode.findById(req.params.id)
  .exec(
    (err, node) => {
      if(!node){
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
        node.name = req.body.name;
        node.location = req.body.location;
        node.stations = req.body.stations;
        node.save((err) => {
          if (err){
            utils.sendJSONresponse(res, 400, {
              "message": "Ha ocurrido un error en la actualización de los datos."
            })
            return;
          }else{
            utils.sendJSONresponse(res, 200, {
              "message" : "Nodo Controlador actualizado exitosamente.",
              data      : node
            })
            return;
          }
        })
      }
    }
  )
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
        let fileText = req.file.buffer.toString();
        let stringArray = fileText.split('\n');
        let jsonArray = [];
        console.log(req.body)
        stringArray.forEach(item => {
          if(item!=''){
            let jsonItem = JSON.parse(item);
            jsonArray.push({
              node        : mongoose.Types.ObjectId(req.body.node),
              station     : mongoose.Types.ObjectId(req.body.station),
              date        : new Date(jsonItem.date),
              temperature : jsonItem.temperature,
              humidity    : jsonItem.humidity,
              radiation   : jsonItem.radiation
            });
          }
        })
        let bulkOp = MiniStationData.collection.initializeOrderedBulkOp();
        jsonArray.forEach((item) => {
          bulkOp.find({
            node            : item.node,
            station         : item.station,
            date            : item.date
          })
          .upsert()
          .update({
            $set : {
              node           : item.node,
              station        : item.station,
              date           : item.date,
              temperature    : item.temperature,
              humidity       : item.humidity,
              radiation      : item.radiation
            }
          })
        })
        bulkOp.execute((error, result) => {
          if(error){
            console.log(JSON.stringify(error, null, "\t"));
            utils.sendJSONresponse(res, 400, {
              message: "Se ha producido un error en la inserción de los datos.",
              error  : error
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

module.exports.getSensorDataByDate = (req, res) => {
  let node    = req.params.node;
  let station = req.params.station;
  let query = {
    station  : mongoose.Types.ObjectId(station),
    node     : mongoose.Types.ObjectId(node)
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
  MiniStationData.aggregate([
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

module.exports.deleteSensorDataByDate = (req, res) => {
  let node    = req.params.node;
  let station = req.params.station;
  let query = {
    station  : mongoose.Types.ObjectId(station),
    node     : mongoose.Types.ObjectId(node)
  }

  if(!req.query.from || !req.query.to || !station){
    utils.sendJSONresponse(res, 400, {
      message : 'Faltan campos en la consulta.'
    });
    return;
  }
  if(req.query.from && req.query.to){
    let fromData = moment(req.query.from, 'YYYY-MM-DD').toDate();
    let toDate   = moment(req.query.to, 'YYYY-MM-DD').add(1, 'day').toDate();
    query.date = {
      $gte : fromData,
      $lt  : toDate
    }
  }
  MiniStationData.remove(query, (err) => {
      if (!err) {
        utils.sendJSONresponse(res, 204, null);
        return;
      }
      else {
        utils.sendJSONresponse(res, 500, "Ocurrió un error al eliminar los datos.");
        return;
      }
    }
  )
}
