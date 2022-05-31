const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const AdminSchema = new Schema({
  permissions: [ Number ],
  isAdmin: {
    type: Boolean,
    default: false
  },
  image: {
    url: {
      type: String,
      default: 'fa-user-shield'
    },
    fileName: String
  }
});

AdminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', AdminSchema);