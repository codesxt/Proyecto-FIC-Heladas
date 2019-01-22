const mongoose = require('mongoose')
const utils = require('./utils')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'model-files')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage
}).single('file')

module.exports.getAll = (req, res) => {
  let filenames = fs.readdirSync('./model-files')
  let data = []
  filenames.forEach(filename => {
    if (filename.endsWith('.RData')) {
      data.push({
        file: filename,
        fullpath: 'http://' + req.headers.host + '/model-files/' + filename
      })
    }
  })
  utils.sendJSONresponse(res, 200, {
    data: data
  })
}

module.exports.delete = (req, res) => {
  fs.unlink('./model-files/' + req.params.filename, (error) => {
    if (error) {
      utils.sendJSONresponse(res, 400, {
        message: 'Error al eliminar el archivo: ' + req.params.filename,
        error  : error
      })
    } else {
      utils.sendJSONresponse(res, 204, null)
    }
  })
}

module.exports.uploadFiles = (req, res) => {
  upload(req, res, (err) => {
    if(err){
      utils.sendJSONresponse(res, 400, {
        message:"Ocurrió un error al subir el archivo.",
        error  : err
      });
      return;
    }else{
      utils.sendJSONresponse(res, 201, {
        message: 'Archivos subidos'
      })
    }
  })
}
