/*
{
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
}
*/
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var agrometSensorDataSchema = new mongoose.Schema({
  station: {
    type : ObjectId,
    ref  : 'AgrometStation',
    required : true
  },
  date: {
    type : Date,
    required : true
  },
  airTemperatureAvg : {
    type : Number
  },
  hourlyRainfall : {
    type : Number
  },
  relativeHumidityAvg : {
    type : Number
  },
  atmosphericPressure : {
    type : Number
  },
  solarRadiationMax : {
    type : Number
  },
  windSpeedMax : {
    type : Number
  },
  temperatureMin : {
    type : Number
  },
  temperatureMax : {
    type : Number
  },
  windDirection : {
    type : Number
  },
  degreeDay : {
    type : Number
  },
  coldHours : {
    type : Number
  }
}, {
  timestamps: true
});
agrometSensorDataSchema.index({
  station : 1,
  date    : 1
}, {
  unique  : true
})
mongoose.model('AgrometSensorData', agrometSensorDataSchema, 'agrometsensordata');
