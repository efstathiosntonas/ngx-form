var mongoose     = require('mongoose'),
    passwordHash = require('password-hash'),
    config       = require('./server/config/config'),
    MongoClient  = require('mongodb').MongoClient,
    async        = require('async'),
    fs           = require('fs'),
    Schema       = mongoose.Schema,
    uploadsDir   = './server/uploads',
    tempDir   = './server/uploads/tmp',
    formsDir     = './server/uploads/forms',
    profilesDir  = './server/uploads/profiles';

var databaseURL = config.database;

var user = new Schema({
    email: {type: String, unique: true, required: true, lowercase: true},
    password: {type: String, required: true},
    forms: [{type: Array}],
    role: {type: Array, default: ['user']}
  },
  {timestamps: true}
);

user.pre('save', function (next) {
  var user = this;
  if (!user.isNew && !user.isModified('password')) {
    return next();
  }
  var hashedPass = passwordHash.generate(user.password);
  user.password  = hashedPass;
  console.log(user.password);
  next();
});

var User = mongoose.model('User', user);

async.series([
    function (callback) {
      if (!fs.existsSync(uploadsDir)){
        fs.mkdirSync(uploadsDir);
      }else
      {
        console.log("Uploads directory already exist");
      }
      if (!fs.existsSync(formsDir)){
        fs.mkdirSync(formsDir);
      }else
      {
        console.log("Forms directory already exist");
      }
      if (!fs.existsSync(tempDir)){
        fs.mkdirSync(tempDir);
      }else
      {
        console.log("Temp directory already exist");
      }
      if (!fs.existsSync(profilesDir)){
        fs.mkdirSync(profilesDir);
      }else
      {
        console.log("Profiles directory already exist");
      }

      MongoClient.connect(databaseURL, function (err, db) {
        if (err) throw err;
        db.dropDatabase(function (err, result) {
          if (err) throw err;
          console.log('drop ', result);
          db.close(true, function (err, result) {
            if (err) throw err;
            console.log('close ', result);
            callback(null, 'Success, database is dropped');
          })
        })
      })
    },
    function (callback) {
      mongoose.Promise = global.Promise;
      mongoose.connect(databaseURL);
      mongoose.connection.on('connected', function () {
        console.log('db connected via mongoose');

        callback(null, 'SUCCESS - Connected to mongodb');
      });
    },
    function (callback) {
      // BEGIN SEED DATABASE
      var users     = [];
      var userCount = 1;
      //  for (var i = 0; i < userCount; i++) {
      var user      = new User({
        email: 'test@test.com',
        // Password will be hashed in the userSchema.pre middleware
        password: 'testpass',
        forms: [],
        role: 'admin'
      });
      users.push(user);
      //   }

      console.log("Populating database with %s users ", users.length);

      async.eachSeries(
        users,
        function (user, userSavedCallBack) {
          user.save(function (err) {
            if (err) {
              // Send JSON response to console for errors
              console.dir(err);
            }
            console.log("Saving user # %s out of %s ", user.email, userCount);
            userSavedCallBack();
          });
        },
        function (err) {
          if (err) console.dir(err);
          console.log("Finished aysnc.each in seeding db");
          // Execute callback function from line 130 to signal to async.series that
          // all asynchronous calls are now done
          callback(null, 'SUCCESS - Seed database');
        }
      );
    }
  ],

// This function executes when everything above is done
  function (err, results) {

    console.log("\n\n--- Database seed progam completed ---");

    if (err) {
      console.log("Errors = ");
      console.dir(errors)
    } else {
      console.log("Results = ");
      console.log(results);
    }

    console.log("\n\n--- Exiting database seed progam ---");
    // Exit the process to get back to terrminal console
    process.exit(0);
  });
