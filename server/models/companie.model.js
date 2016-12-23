var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    Form                    = require('../models/user.model'),
    mongooseUniqueValidator = require('mongoose-unique-validator');

var companie = new Schema({
  //  _id: String,
    address: String,
    text: String,
    region_id: mongoose.Schema.Types.ObjectId

  },
  {
    timestamps: true
  });

companie.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Companie', companie);
