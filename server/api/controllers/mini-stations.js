const moment      = require('moment');
const mongoose    = require('mongoose');
const ControllerNode = mongoose.model('ControllerNode');
const utils       = require('./utils');

const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

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
