var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var ObjectId = mongoose.Schema.ObjectId;

var documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: ObjectId,
    unique: false
  }
}, {
  timestamps: true
});

mongoose.model('Document', documentSchema);
