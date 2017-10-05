const mongoose = require('mongoose');
const validator = require('validator');
// var nodemailer = require('nodemailer');
const utils = require('./utils');
const User = mongoose.model('User');

module.exports.getProfile = (req, res) => {
  User.findById(req.user._id, (err, user) => {
    utils.sendJSONresponse(res, 200, {
      _id  : user._id,
      name : user.name,
      email: user.email
    });
  })
}

module.exports.updateProfile = (req, res) => {
  let user = req.user;
  User.findByIdAndUpdate(req.user._id, {
    $set: {
      name : req.body.name,
      email: req.body.email
    }
  },{
    new: true
  }, (err, user) => {
    if(err){
      utils.sendJSONresponse(res, 404, {
        message: "Error al actualizar el documento."
      });
      return;
    }else{
      utils.sendJSONresponse(res, 200, {
        user : user,
        token: user.generateJwt()
      });
      return;
    }
  });
}
