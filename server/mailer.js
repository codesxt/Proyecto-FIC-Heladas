const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const moment = require('moment');
moment.locale('es');


var mailGenerator = new Mailgen({
    theme: 'salted',
    product: {
      // Appears in header & footer of e-mails
      name: 'Predicción de Heladas ❄',
      link: 'https://heladas.utalca.cl/predicciones/',
      copyright: '© 2017 Proyecto FIC, código BIP-30.481.998-0.',
    }
});

/*
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'wfqeww23z5b3r7np@ethereal.email',
        pass: 'W7JPKGrHKwpfb1bDp4'
    }
});
*/

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'notificaciones.heladas@gmail.com',
    pass: 'proyectoficheladas'
  }
});


module.exports.sendFrostsEmail = (emailAddress, frosts) => {
  let frostData = [];
  for(let frost of frosts){
    frostData.push({
      estación: frost.name,
      predicción: getPredictionText(frost.prediction)
    })
  }
  var email = {
    body: {
        title: 'Reporte de Predicción de Heladas',
        intro: 'A continuación se detallan las predicciones de heladas de las estaciones a las que se ha suscrito para el día ' + moment().add(1, 'days').format('LL')+".",
        table: {
          data: frostData
        },
        action: {
            instructions: 'Para revisar el detalle de las predicciones, haga click aquí:',
            button: {
                color: '#22BC66',
                text: 'Ver Predicciones',
                link: 'http://heladas.utalca.cl/predicciones/'
            }
        }
    }
  };
  let mailOptions = {
    from: '"Notificaciones Heladas" <foo@blurdybloop.com>',
    to: emailAddress,
    subject: 'Predicciones de Heladas para el día ' + moment().add(1, 'days').format('LL') +" ❄",
    text: mailGenerator.generatePlaintext(email),
    html: mailGenerator.generate(email)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    };
  });
}

getPredictionText = (prediction) => {
  if(prediction==true){
    return "Hay probabilidad de heladas";
  }else if(prediction==false){
    return "No hay probabilidad de heladas";
  }else{
    return "No hay datos en la estación. Probablemente esté en mantenimiento."
  }
}
