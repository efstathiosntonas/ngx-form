let mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    Form                    = require('../models/form.model'),
    mongooseUniqueValidator = require('mongoose-unique-validator'),
    bcrypt                  = require('bcrypt');

var UserSchema = new Schema({
    email               : {type: String, unique: true, required: true, lowercase: true},
    password            : {type: String, required: true},
    forms               : [{type: Schema.Types.ObjectId, ref: 'Form'}],
    resetPasswordToken  : String,
    resetPasswordExpires: String,
    profilePic          : String,
    // you might want more user roles so an array would be fine
    role                : {type: Array, default: ['user']}
  },
  {
    // this will add created_at and updated_at automatically on every mongo documernt (user, forms)
    timestamps: true
  });

// Hash user password when registering or when changing password
UserSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt,  (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.index({volAddressCoords: '2dsphere'});

// create method to compare password upon login

UserSchema.methods.comparePassword = function (pw, cb) {
  bcrypt.compare(pw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', UserSchema);
