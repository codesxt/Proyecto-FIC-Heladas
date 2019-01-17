const schedule = require('node-schedule');
const request = require('request');
const Q = require('q');
const rp = require('request-promise');
const nodemailer = require('nodemailer');
const mailer = require('./mailer');
const moment = require('moment');

const host = 'http://localhost:3000';

const mongoose = require('mongoose');
const db = require('./api/models/db');
const User = mongoose.model('User');
const Station = mongoose.model('Station');
const AgrometStation = mongoose.model('AgrometStation');

//const sms = require('./sms_notification');

sendFrostNotifications = (frosts) => {
  User.find((err, users) => {
    if(err){
      console.log("[Frost Notification] Couldn't find users. Aborting.");
      return;
    }else{
      console.log("[Frost Notification] User list obtained. Sending notifications.");
      for(let user of users){
        if(user.subscriptions.length>0){
          console.log("[Frost Notification] Sending notifications to user: " + user.name);
          let userFrosts = [];
          let dailyEmail = user.settings.dailyEmail;
          userFrosts = frosts.filter((frost) => {
            return user.subscriptions.indexOf(frost._id) > -1;
          })
          if(dailyEmail == false){
            // Si el usuario desea recibir correos sólo cuando hay alertas
            userFrosts = userFrosts.filter((frost) => {
              return frost.prediction == true;
            })
            if(userFrosts.length==0){
              console.log("[Frost Notification] There aren't frosts of interest for the user. Not sending email.");
            }else{
              console.log("[Frost Notification] Sending email to user: " + user.name);
              mailer.sendFrostsEmail(user.email, userFrosts);
            }
          }else{
            // Si el usuario desea recibir reportes diarios
            console.log("[Frost Notification] Sending daily email to user: " + user.name);
            mailer.sendFrostsEmail(user.email, userFrosts);
          }
        }
      }
    }
  })
}

notifyFrosts = () => {
  // Listar Estaciones
  request.get(host + '/api/v1/public-stations',
    (error, response, body) => {
      body = JSON.parse(body);
      let queries = [];
      for(let station of body.data){
        let url = host;

        // Selecciona la url correspondiente de consulta según el horario
        if(new Date().getHours() < 15){
          url+='/api/v1/day-before-prediction/';
        }else{
          url+='/api/v1/day-prediction/';
        }

        // Genera un arreglo con las promesas que consultan los datos de predicción
        queries.push(
          rp({
            uri: url+station._id,
            method: 'GET'
          }).then((res) => {
            return JSON.parse(res);
          })
        )
      }

      // Cuando todas las promesas concluyeron, genera una lista de estaciones y heladas
      Q.all(queries).then(
        (data) => {
          let frosts = [];
          for(let pred of data){
            frosts.push({
              _id: pred.data.stationId,
              name: pred.data.station,
              prediction: pred.data.frost
            })
          }
          sendFrostNotifications(frosts);
        }
      )
    }
  )
}

executeAutomatedBackup = () => {
  let startDate = moment().subtract(1, 'days').set('hour', 0).set('minute', 0).set('millisecond', 0);
  let from      = startDate.format('YYYY-MM-DD');
  AgrometStation.find({
    'settings.autobackup' : true
  }, (error, result) => {
    for(let station of result){
      request.put(host + '/api/v1/agrometdata/auto/'+station._id+'?from='+from,
        (error, response, body) => {
          if(error){
            console.log('Ocurrió un error al respaldar automáticamente los datos de la estación ' + station.name);
            console.log(error);
          }
          if(body){
            console.log('Datos respaldados automáticamente para la estación ' + station.name);
            console.log(body);
          }
        }
      )
    }
  })
}

const taskModule = require('./tasks')

module.exports.run = () => {
  console.log("[Task Scheduler] Scheduling Tasks...")
  // const notificationJob = schedule.scheduleJob('5 18 * * *', notifyFrosts);
  // const backupJob       = schedule.scheduleJob('0 1 * * *', executeAutomatedBackup);
  //const notificationJob = schedule.scheduleJob('*/1 * * * *', notifyFrosts);

  const agrometBackupJob = schedule.scheduleJob('*/1 * * * *', taskModule.agrometBackupTask);
  console.log("[Task Scheduler] Task Schedule set")
}
