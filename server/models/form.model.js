var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongooseUniqueValidator = require('mongoose-unique-validator');

var form = new Schema({
  textInputOne: { type: String, required:true },
  textInputTwo: { type: String, required: true },
  imagePath: { type: String, required: true }
});

form.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Form', form);
