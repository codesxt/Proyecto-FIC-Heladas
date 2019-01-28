const utils = require('./utils');
const request = require('request');

module.exports.readEmaList = (req, res) => {
  var hostname    = req.headers.host;
  request.post('https://heladas.utalca.cl/heladas/monitor/acciones.php?acc=2',
    (error, response, body) => {
      if(error){
        console.log(error);
        utils.sendJSONresponse(res, 404, {
          message: "EMA List not found."
        });
        return;
      }else{
        body = JSON.parse(body);
        let stationsList = body.data;
        let emaList = [];
        for(let station of stationsList){
          emaList.push({
            id: station.id_est,
            name: station.nom_est
          })
        }
        utils.sendJSONresponse(res, 200, {
          meta: {
            "total-items": emaList.length
          },
          links: {
            self: hostname+'/api/v1/ema'
          },
          data: emaList
        })
        return;
      }
    }
  );
}

module.exports.readEmaPrediction = (req, res) => {
  var hostname    = req.headers.host;
  let emaId = req.params.id;
  request.post('https://heladas.utalca.cl/heladas/consulta/index.php?id_est='+emaId,
    (error, response, body) => {
      if(error){
        console.log(error);
        utils.sendJSONresponse(res, 404, {
          message: "EMA List not found."
        });
        return;
      }else{
        body = JSON.parse(body);
        let prediction = {
          emaId: emaId,
          station: body.estacion,
          date: body.fecha_pred
        };
        if(body.nom_estado=="n"){
          prediction.frost = false;
        }else if(body.nom_estado=="y"){
          prediction.frost = true;
        }else{
          prediction.frost = undefined;
        }
        utils.sendJSONresponse(res, 200, {
          links: {
            self: hostname+'/api/v1/prediction/'+emaId
          },
          data: prediction
        })
        return;
      }
    }
  );
}
