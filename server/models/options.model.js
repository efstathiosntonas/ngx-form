var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    mongooseUniqueValidator = require('mongoose-unique-validator');

var options = new Schema({
    design: {
      mainPage : {}
    }
  }
);

options.plugin(mongooseUniqueValidator);


module.exports = mongoose.model('Options', options);
