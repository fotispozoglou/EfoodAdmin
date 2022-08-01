const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const AdminSchema = new Schema({
  isAdmin: {
    type: Boolean,
    default: false
  },
  token: String
});

AdminSchema.plugin(passportLocalMongoose);

AdminSchema.statics.serializeUser = function() {

  return function(user, cb) {

    cb(null, user.id);

  }

};

AdminSchema.statics.deserializeUser = function() {

  const self = this;

  return function(id, cb) {

    self.findOne({ _id: id }, cb);
  
  }

};

module.exports = mongoose.model('Admin', AdminSchema);