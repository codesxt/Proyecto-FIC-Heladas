const utils = require('./utils');
const request = require('request');

module.exports.readEmaList = (req, res) => {
  var hostname    = req.headers.host;
  request.post('http://srvbioinf1.utalca.cl/heladas/monitor/acciones.php?acc=2',
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
