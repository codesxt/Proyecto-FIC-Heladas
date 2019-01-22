var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['administrator', 'user'],
    default: 'user'
  },
  subscriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'AgrometStation'
  }],
  settings: {
    dailyEmail: {
      type: Boolean,
      default: true
    }
  },
  hash: String,
  salt: String
}, {
  timestamps: true
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function(){
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.JWT_SECRET);
}

mongoose.model('User', userSchema);
