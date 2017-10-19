const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports.sendTestMessageTo = (number) => {
  client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: number,
    body: "Este es un mensaje de prueba enviado a través de Twilio."
  }).then((messsage) => {
    console.log(message);
  });
}
