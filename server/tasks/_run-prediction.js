const path           = require('path')
const { spawn }      = require('child_process')
var exec = require('child-process-promise').exec

let appDir = path.dirname(require.main.filename);
    appDir = appDir.replace('/bin','') + '/Rscripts'
let env = { DIRNAME: appDir, ...process.env }

runPrediction = (filename, modelFile, date, hour) => {
  /*
  console.log(
    'Ejecutando predicciones:',
    date,
    filename,
    modelFile,
    null,
    null,
    null,
    hour
  )
  */
  let args = [
    "./main.R",
    date,
    filename,
    modelFile,
    null,
    null,
    null,
    hour,
    '--vanilla'
  ];
  let options = {
    env      : env,
    cwd      : appDir,
    encoding : "utf8"
  };
  let command = 'Rscript ' + appDir + '/' + args[0].replace('./', '')
  for(let i = 1; i < args.length; i++) {
    command += ' ' + args[i]
  }
  return exec(command, options)
}

module.exports = runPrediction
