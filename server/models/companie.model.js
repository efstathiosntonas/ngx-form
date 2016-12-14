var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    Form                    = require('../models/user.model'),
    mongooseUniqueValidator = require('mongoose-unique-validator');

var companie = new Schema({
    address: String,
  },
  {
    timestamps: true
  });

companie.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Companie', companie);
