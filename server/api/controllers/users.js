const mongoose = require('mongoose');
const validator = require('validator');
const utils = require('./utils');
const User = mongoose.model('User');

const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.readUserList = (req, res) => {
  var hostname    = req.headers.host;
  let requestData = JsonApiQueryParser.parseRequest(req.url);
  let pageNumber  = requestData.queryData.page.number  || 0;
  let pageSize    = requestData.queryData.page.size    || 0;
  let query = { };
  User.find(
    query
    ,
    '_id name email role createdAt',
    {
      sort:{ },
      skip:pageNumber*pageSize,
      limit:pageSize*1
    },
    function(err, users){
      if(err){
        console.log(err);
        utils.sendJSONresponse(res, 400, err);
      }else{
        //console.log(events);
        User.count(query, (err, count) => {
          utils.sendJSONresponse(res, 201, {
            meta: {
              "total-pages": count/pageSize,
              "total-items": count
            },
            links: {
              self: hostname+'/api/v1/users'
            },
            data: users
          });
        });
      }
    }
  );
}

module.exports.createUser = (req, res) => {

}

module.exports.readUser = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if(err){
      console.log(err);
      utils.sendJSONresponse(res, 400, err);
    }else{
      var resObject = {
        type: "users",
        id: user._id,
        attributes: {
          email: user.email,
          name: user.name,
          role: user.role
        },
        links: {
          self: req.headers.host+'/api/v1/users/'+user._id
        }
      };
      utils.sendJSONresponse(res, 200, resObject);
    }
  });
}

module.exports.updateUser = (req, res) => {
  if (!req.params.userId) {
    utils.sendJSONresponse(res, 404, {
      "message": "Usuario no encontrado. Se requiere un ID para buscarlo."
    });
    return;
  }
  User.findById(req.params.userId)
  .exec(
    function(err, user){
      if (!user) {
        utils.sendJSONresponse(res, 404, {
          "message": "ID de usuario no encontrado."
        });
        return;
      } else if (err) {
        utils.sendJSONresponse(res, 400, err);
        return;
      }
      user.name = req.body.name;
      user.email = req.body.email;
      user.role = req.body.role;
      user.save(function(err){
        if (err){
          console.log(user);
          console.log("Error: "+err);
          utils.sendJSONresponse(res, 404, {
            "message": "Ha ocurrido un error en la actualización de los datos. Revise que el correo no exista o los datos sean inconsistentes."
          })
          return;
        }else{
          utils.sendJSONresponse(res, 200, user);
          return;
        }
      });
    }
  )
}

module.exports.deleteUser = (req, res) => {

}
