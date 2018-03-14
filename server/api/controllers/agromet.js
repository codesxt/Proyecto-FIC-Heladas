const utils = require('./utils');
const request = require('request');
const parseString = require('xml2js').parseString;
const moment = require('moment');

module.exports.getEmaHistory = (req, res) => {
  let emaId = req.params.emaId;
  if(!emaId){
    utils.sendJSONresponse(res, 400, {
      message: "EMA no especificada."
    });
  }
  if(moment(req.query.from).isValid()){
    let from  = moment(req.query.from);
    let to    = req.query.to;

    if(to){
      to = moment(to);
    }else{
      to = from.clone().add(1, 'day').subtract(1, 'minute');
    }

    if(to.isValid() && to.isAfter(from)){
      // Hacer todo
      let formData = {
        ema_ia_id : emaId,
        dateFrom  : from.format('YYYY-MM-DD HH:mm:ss'),
        dateTo    : to.format('YYYY-MM-DD HH:mm:ss')
      }
      request.post('https://www.agromet.cl/ext/aux/getGraphData.php',
        {
          form: formData
        },
        (error, response, body) => {
          if(error){
            console.log(error);
            utils.sendJSONresponse(res, 404, {
              message: "EMA not found."
            });
            return;
          }else{
            parseString(body, function (err, result) {
              if(err){
                console.log(err);
                console.log("Error parsing body:");
                console.log(body);
                utils.sendJSONresponse(res, 404, {
                  message: "Ocurrió un error al procesar los datos de Agromet."
                });
                return;
              }
              data = {};
              // Obtener unidades del resultado
              let units = [];
              for(let u of result.estacion.eje){
                units.push(u.split("|").pop());
              }

              // Obtener Etiquetas de los resultados
              let labels = [];
              for(let l of result.estacion.gra){
                labels.push(l.split("|")[1]);
              }

              // Obtener datos
              let measurements = [];
              for(let d of result.estacion.dato){
                //labels.push(d.split("|")[1]);
                let spl = d.split("|");
                // Se asume que la fecha está en zona horaria local.
                // Si estuviera en UTC sería moment.utc()
                measurements.push({
                  date                : moment(spl[1]),
                  airTemperatureAvg   : spl[3],
                  hourlyRainfall      : spl[5],
                  relativeHumidityAvg : spl[7],
                  atmosphericPressure : spl[9],
                  solarRadiationMax   : spl[11],
                  windSpeedMax        : spl[13],
                  temperatureMin      : spl[15],
                  temperatureMax      : spl[17],
                  windDirection       : spl[19],
                  degreeDay           : spl[21],
                  coldHours           : spl[23]
                })
              }

              data.idEMA  = result.estacion.$.id;
              data.data   = measurements;
              data.units  = units;
              data.labels = labels;
              data.from   = from;
              data.to     = to;
              utils.sendJSONresponse(res, 200, data);
              return;
            });
          }
        }
      )
    }else{
      utils.sendJSONresponse(res, 400, {
        message : "Error en el formato de la fecha de término."
      });
      return;
    }
  }else{
    utils.sendJSONresponse(res, 400, {
      message : "Error en el formato de la fecha de inicio."
    });
    return;
  }
}

module.exports.getVariables = (req, res) => {
  request.get('https://www.agromet.cl/ext/aux/getTiposVariables.php',
    (error, response, body) => {
      if(error){
        console.log(error);
        utils.sendJSONresponse(res, 404, {
          message: "Variables not found."
        });
        return;
      }else{
        try {
          body = JSON.parse(body);
        } catch(e) {
          utils.sendJSONresponse(res, 503, {
            message: 'No se pudieron obtener los datos de Agromet. Intente más tarde.'
          })
          return;
        }
        let variables = [];
        for(let v of body){
          variables.push({
            variable : v[0],
            name     : v[1]
          })
        }
        utils.sendJSONresponse(res, 200, {
          variables: variables
        })
      }
    }
  )
}

module.exports.getRegions = (req, res) => {
  request.get('https://www.agromet.cl/ext/aux/getRegiones.php',
    (error, response, body) => {
      if(error){
        console.log(error);
        utils.sendJSONresponse(res, 404, {
          message: "Variables not found."
        });
        return;
      }else{
        try {
          body = JSON.parse(body);
        } catch(e) {
          utils.sendJSONresponse(res, 503, {
            message: 'No se pudieron obtener los datos de Agromet. Intente más tarde.'
          })
          return;
        }
        let regions = [];
        for(let v of body){
          regions.push({
            id    : v[0],
            name  : v[1]
          })
        }
        utils.sendJSONresponse(res, 200, {
          regions: regions
        })
      }
    }
  )
}

module.exports.getCities = (req, res) => {
  let regionId = req.query.region;
  if(!regionId){
    utils.sendJSONresponse(res, 400, {
      message: "Expresión mal formada. Se debe especificar el id de la región."
    });
    return;
  }
  request.get('https://www.agromet.cl/ext/aux/getComunasRegion.php?reg_ia_id='+regionId,
    (error, response, body) => {
      if(error){
        console.log(error);
        utils.sendJSONresponse(res, 404, {
          message: "Variables not found."
        });
        return;
      }else{
        try {
          body = JSON.parse(body);
        } catch(e) {
          utils.sendJSONresponse(res, 503, {
            message: 'No se pudieron obtener los datos de Agromet. Intente más tarde.'
          })
          return;
        }
        let cities = [];
        for(let v of body){
          cities.push({
            id    : v[0],
            name  : v[1]
          })
        }
        utils.sendJSONresponse(res, 200, {
          cities: cities
        })
      }
    }
  )
}

module.exports.getFilteredEMAs = (req, res) => {
  let regionId = req.query.region;
  if(!regionId){
    utils.sendJSONresponse(res, 400, {
      message: "Expresión mal formada. Se debe especificar el id de la región."
    });
    return;
  }
  let url = 'https://www.agromet.cl/ext/aux/getFilteredEMAS.php?';
  url += 'reg_ia_id='+regionId;
  let cityId = req.query.city;
  console.log(cityId);
  if(cityId){
    url += '&com_ia_id=' + cityId;
  }
  request.get(url,
    (error, response, body) => {
      if(error){
        console.log(error);
        utils.sendJSONresponse(res, 404, {
          message: "Variables not found."
        });
        return;
      }else{
        try {
          body = JSON.parse(body);
        } catch(e) {
          utils.sendJSONresponse(res, 503, {
            message: 'No se pudieron obtener los datos de Agromet. Intente más tarde.'
          })
          return;
        }
        let emas = [];
        for(let v of body){
          emas.push({
            id    : v[0],
            name  : v[1]
          })
        }
        utils.sendJSONresponse(res, 200, {
          stations: emas
        })
      }
    }
  )
}
