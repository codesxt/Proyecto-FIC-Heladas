const passport = require('passport');
const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const moment = require('moment');
// var nodemailer = require('nodemailer');
const utils = require('./utils');
const User = mongoose.model('User');

module.exports.register = (req, res) => {
  if(!req.body.name || !req.body.email || !req.body.password1 || !req.body.password2) {
    utils.sendJSONresponse(res, 400, {
      "message": "All fields required."
    });
    return;
  }else if(req.body.password1 != req.body.password2){
    utils.sendJSONresponse(res, 400, {
      "message": "Las contraseñas deben ser iguales."
    });
    return;
  }

  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password1);

  user.save(function(err){
    var token;
    if (err){
      utils.sendJSONresponse(res, 404, {
        "message": "Ha ocurrido un error en la creación del usuario. Probablemente el correo utilizado ya existe en el sistema."
      })
    }else{
      token = user.generateJwt();
      utils.sendJSONresponse(res, 200, {
        "token": token
      });
    }
  });
};

module.exports.login = (req, res) => {
  if(!req.body.email || !req.body.password){
    utils.sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  passport.authenticate('local', function(err, user, info){
    var token;

    if(err){
      utils.sendJSONresponse(res, 404, err);
      return;
    }

    if(user){
      token = user.generateJwt();
      utils.sendJSONresponse(res, 200, {
        "token": token
      });
    }else{
      utils.sendJSONresponse(res, 401, info);
    }
  })(req, res);
};

exports.roleAuthorization = function(roles){
  return function(req, res, next){
    var user = req.user;
    User.findById(user._id, function(err, foundUser){
      if(err){
        utils.sendJSONresponse(res, 404, {
          message: 'Usuario no encontrado.'
        });
        return next(err);
      }

      if(roles.indexOf(foundUser.role) > -1){
        return next();
      }
      utils.sendJSONresponse(res, 401, {
        message: 'No tienes autorización para ver este contenido.'
      });
      return next('Unauthorized');
    });
  };
}
