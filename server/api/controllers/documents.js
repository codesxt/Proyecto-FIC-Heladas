const mongoose = require('mongoose');
const validator = require('validator');
const utils = require('./utils');
const Document = mongoose.model('Document');

const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.readDocumentList = (req, res) => {
  var hostname    = req.headers.host;
  let requestData = JsonApiQueryParser.parseRequest(req.url);
  let pageNumber  = requestData.queryData.page.number  || 0;
  let pageSize    = requestData.queryData.page.size    || 0;
  let query = { };
  Document.find(
    query
    ,
    '_id title author',
    {
      sort:{ },
      skip:pageNumber*pageSize,
      limit:pageSize*1
    },
    function(err, documents){
      if(err){
        console.log(err);
        utils.sendJSONresponse(res, 400, err);
      }else{
        //console.log(events);
        Document.count(query, (err, count) => {
          utils.sendJSONresponse(res, 201, {
            meta: {
              "total-pages": count/pageSize,
              "total-items": count
            },
            links: {
              self: hostname+'/api/v1/documents'
            },
            data: documents
          });
        });
      }
    }
  );
}

module.exports.readUserDocumentList = (req, res) => {
  var hostname    = req.headers.host;
  let requestData = JsonApiQueryParser.parseRequest(req.url);
  let pageNumber  = requestData.queryData.page.number  || 0;
  let pageSize    = requestData.queryData.page.size    || 0;
  let query = {
    author: req.user._id
  };
  Document.find(
    query
    ,
    '_id title author',
    {
      sort:{ },
      skip:pageNumber*pageSize,
      limit:pageSize*1
    },
    function(err, documents){
      if(err){
        console.log(err);
        utils.sendJSONresponse(res, 400, err);
      }else{
        //console.log(events);
        Document.count(query, (err, count) => {
          utils.sendJSONresponse(res, 201, {
            meta: {
              "total-pages": count/pageSize,
              "total-items": count
            },
            links: {
              self: hostname+'/api/v1/user-documents'
            },
            data: documents
          });
        });
      }
    }
  );
}

module.exports.createDocument = (req, res) => {
  var document = new Document();
  document.title = req.body.title;
  document.content = req.body.content;
  document.author = req.user._id;
  document.save((err) => {
    if(err){
      utils.sendJSONresponse(res, 400, {
        message: "El documento no pudo ser insertado."
      });
      return;
    }
    utils.sendJSONresponse(res, 200, {
      message: "Documento Guardado exitosamente."
    })
    return;
  })
}

module.exports.readDocument = (req, res) => {
  Document.findById(req.params.id, (err, document) => {
    if(err){
      console.log(err);
      utils.sendJSONresponse(res, 400, err);
    }else{
      var resObject = {
        type: "documents",
        id: document._id,
        attributes: {
          title: document.title,
          content: document.content,
          author: document.author
        },
        links: {
          self: req.headers.host+'/api/v1/documents/'+document._id
        }
      };
      utils.sendJSONresponse(res, 200, resObject);
    }
  });
}

module.exports.updateDocument = (req, res) => {
  if (!req.params.id) {
    utils.sendJSONresponse(res, 404, {
      "message": "Documento no encontrado. Se requiere especificar un ID."
    });
    return;
  }
  Document.findById(req.params.id)
  .exec(
    (err, doc) => {
      if(!doc){
        utils.sendJSONresponse(res, 404, {
          "message": "Documento no encontrado."
        });
        return;
      }else if (err) {
        utils.sendJSONresponse(res, 400, {
          message: "Ocurrió un error al actualizar el documento.",
          error: err
        });
        return;
      }
      if(req.user._id != doc.author){
        utils.sendJSONresponse(res, 401, {
          message: "Sólo el autor del documento puede editarlo.",
          error: err
        });
        return;
      }else{
        doc.title = req.body.title;
        doc.content = req.body.content;
        doc.save((err) => {
          if (err){
            utils.sendJSONresponse(res, 400, {
              "message": "Ha ocurrido un error en la actualización de los datos."
            })
            return;
          }else{
            utils.sendJSONresponse(res, 200, {
              "message": "Documento actualizado exitosamente.",
              document: doc
            })
            return;
          }
        })
      }
    }
  )
}

module.exports.deleteDocument = (req, res) => {
  // Add verification if user is owner of the document
  if(req.params.id){
    Document.findByIdAndRemove(req.params.id)
    .exec(
      function(err, doc){
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
      "message": "No se encontró el documento."
    })
    return;
  }
}
