let mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    User                    = require('../models/user.model'),
    fs                      = require('fs'),
    mongooseUniqueValidator = require('mongoose-unique-validator');

let form = new Schema({
    textInputOne: {type: String},
    textInputTwo: {type: String},
    imagePath   : {type: String},
    owner       : {type: Schema.Types.ObjectId, ref: 'User'}
  },
  {
    timestamps: {createdAt: 'dateSubmitted'}
  });

form.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Form', form);
