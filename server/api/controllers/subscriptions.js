const mongoose = require('mongoose');
const utils = require('./utils');
const User = mongoose.model('User');
const Station = mongoose.model('Station');

module.exports.readUserSubscriptions = (req, res) => {
  User
  .findById(req.user._id)
  .populate('subscriptions')
  .exec((err, user) => {
    utils.sendJSONresponse(res, 200, {
      _id  : user._id,
      subscriptions : user.subscriptions
    });
  })
}

module.exports.subscribeToStation = (req, res) => {
  let user = req.user;
  let stationId = req.params.stationId;
  Station.findById(stationId, (err, station) => {
    if(err){
      utils.sendJSONresponse(res, 404, {
        message: "No se encontró la estación."
      });
      return;
    }else{
      User.findById(user._id, (err, user) => {
        if(err){
          utils.sendJSONresponse(res, 404, {
            message: "No se encontró el usuario."
          });
          return;
        }else{
          user.subscriptions.addToSet(station);
          user.save((err) => {
            if(err){
              utils.sendJSONresponse(res, 400, {
                message: "No se pudo modificar el usuario."
              });
              return;
            }else{
              utils.sendJSONresponse(res, 200, {
                _id  : user._id,
                subscriptions : user.subscriptions
              });
            }
          })
        }
      })
    }
  })
}

module.exports.unsubscribeToStation = (req, res) => {
  let user = req.user;
  let stationId = req.params.stationId;
  Station.findById(stationId, (err, station) => {
    if(err){
      utils.sendJSONresponse(res, 404, {
        message: "No se encontró la estación."
      });
      return;
    }else{
      User.findById(user._id, (err, user) => {
        if(err){
          utils.sendJSONresponse(res, 404, {
            message: "No se encontró el usuario."
          });
          return;
        }else{
          user.subscriptions.pull(station);
          user.save((err) => {
            if(err){
              utils.sendJSONresponse(res, 400, {
                message: "No se pudo modificar el usuario."
              });
              return;
            }else{
              utils.sendJSONresponse(res, 200, {
                _id  : user._id,
                subscriptions : user.subscriptions
              });
            }
          })
        }
      })
    }
  })
}
