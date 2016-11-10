var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    User                    = require('../models/user.model'),
    mongooseUniqueValidator = require('mongoose-unique-validator');

var form = new Schema({
  textInputOne: {type: String, required: true},
  textInputTwo: {type: String, required: true},
  imagePath: {type: String, required: true},
  owner: {type: Schema.Types.ObjectId, ref: 'User'}
});

form.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Form', form);
