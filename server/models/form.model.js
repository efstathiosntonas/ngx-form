var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    User                    = require('../models/user.model'),
    mongooseUniqueValidator = require('mongoose-unique-validator');

var form = new Schema({
  textInputOne: {type: String},
  textInputTwo: {type: String},
  imagePath: {type: String},
  dateSubmitted: { type:Date, default: Date.now()},
  owner: {type: Schema.Types.ObjectId, ref: 'User'}
});

form.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Form', form);
