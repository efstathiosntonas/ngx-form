var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongooseUniqueValidator = require('mongoose-unique-validator');

var user = new Schema({
  email: { type: String, unique: true, required:true, lowercase: true },
  password: { type: String, required: true }
});

user.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', user);
