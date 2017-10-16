const schedule = require('node-schedule');
const request = require('request');
const Q = require('q');
const rp = require('request-promise');

const host = 'http://localhost:3000';

var notifyFrosts = () => {
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
              name: pred.data.station,
              prediction: pred.data.frost
            })
          }
          console.log("Notificando Heladas.");
          console.log(frosts);
        }
      )

      // Listar suscripciones de usuarios
      // Para cada suscripción, enviar correo con lista de estaciones de interés
    }
  )
}

module.exports.run = () => {
  console.log("[Task Scheduler] Scheduling Tasks...");
  const notificationJob = schedule.scheduleJob('* 00 * * *', notifyFrosts);
  console.log("[Task Scheduler] Task Schedule set");
}
