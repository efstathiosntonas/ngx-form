var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    mongooseUniqueValidator = require('mongoose-unique-validator');

var region = new Schema({
    address: String,
  },
  {
    timestamps: true
  });

region.plugin(mongooseUniqueValidator);


module.exports = mongoose.model('Region', region);
