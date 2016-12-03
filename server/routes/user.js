var express      = require('express'),
    router       = express.Router(),
    passwordHash = require('password-hash'),
    jwt          = require('jsonwebtoken'),
    config       = require('../config/config'),
    fs           = require('fs'),
    multer       = require('multer'),
    mime         = require('mime'),
    path         = require('path'),
    crypto       = require("crypto"),
    gm           = require('gm').subClass({imageMagick: true});

var User = require('../models/user.model');

// user register
router.post('/register', function (req, res, next) {
  var user = new User({
    email: req.body.email,
    password: passwordHash.generate(req.body.password)
  });
  user.save(function (err, result) {
    if (err) {
      return res.status(403).json({
        title: 'There was an issue',
        error: {message: 'The email you entered already exists'}
      });
    }
    res.status(200).json({
      message: 'Registration Successfull',
      obj: result
    })
  })
});

// user login
router.post('/login', function (req, res, next) {
  User.findOne({email: req.body.email}, function (err, doc) {
    if (err) {
      return res.status(403).json({
        title: 'There was a problem',
        error: err
      });
    }
    if (!doc) {
      return res.status(403).json({
        title: 'Wrong Email or Password',
        error: {message: 'Please check if your password or email are correct'}
      })
    }
    if (!passwordHash.verify(req.body.password, doc.password)) {
      return res.status(403).json({
        title: 'You cannot log in',
        error: {message: 'Please check your password or email'}
      })
    }
    var token = jwt.sign({user: doc}, config.secret, {expiresIn: config.jwtExpire});
    return res.status(200).json({
      message: 'Login Successfull',
      token: token,
      userId: doc._id
    })
  })
});

router.use('/', function (req, res, next) {
  var token = req.headers['authorization'];
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        title: 'Authentication failed',
        message: 'Authentication failed',
        error: err
      })
    }
    if (!decoded) {
      return res.status(403).json({
        title: 'Authentication failed',
        error: {message: 'Authentication failed'}
      });
    }
    if (decoded) {
      User.findById(decoded.user._id, function (err, doc) {
        if (err) {
          return res.status(500).json({
            title: 'Fetching user failed',
            message: 'Fetching user failed',
            err: err
          });
        }
        if (!doc) {
          return res.status(404).json({
            title: 'The user was not found',
            error: {message: 'The user was not found'}
          })
        }
        if (doc) {
          req.user = doc;
          next();
        }
      })
    }
  })
});

// get user info
router.get('/profile/:id', function (req, res, next) {
  User.findOne({_id: req.user._id}, function (err, user) {
    if (err) {
      return res.status(403).json({
        title: 'There was a problem',
        error: err
      });
    }
    return res.status(200).json({
      user: user
    })
  })
});

// setting up multer for profile pic upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dest = 'server/uploads/profiles/' + req.user._id;  // i know, i should use dirname blah blah :)
    var stat = null;
    try {
      stat = fs.statSync(dest);
      console.log(dest);
    }
    catch (err) {
      fs.mkdirSync(dest);
    }
    if (stat && !stat.isDirectory()) {
      throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
    }
    cb(null, dest)
  },
  filename: function (req, file, cb) {
    //if you want even more random characters prefixing the filename then change the value '2' below as you wish, right now, 4 charaters are being prefixed
    crypto.pseudoRandomBytes(2, function (err, raw) {
      cb(null, raw.toString('hex') + '.' + file.originalname.toLowerCase());
    });
  }
});

// telling multer what storage we want and filefiltering to check if file is an image, the 'parts' property declares how many fields we are expecting from front end
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000, // 5MB filesize limit
    parts: 3
  },
  fileFilter: function (req, file, cb) {
    var filetypes = /jpe?g|png/;
    var mimetype  = filetypes.test(file.mimetype);
    var extname   = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: File upload only supports the following filetypes - " + filetypes);
  }
});

router.post('/image', upload.single('profilePic'), function (req, res, err) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(500).json({
      message: 'There was an error',
      error: err
    });
  }

  // finding the user who initialized the upload from front end
  User.findById(req.user._id, function (err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        err: err
      });
    }
    // setting our new form to be saved in database, we fetch the data from the front end,
    // req.file.path is coming from multer, we need that value to store the path to database
    // at the end we assinging the owner of the form by passing the user _id to the form
    // in the backend we are referencing each form to the user who uploaded it
    // so later on we can display the data in the front end
    // console.log(req.file);
    // resize middleware, just change 400 to whatever you like, the null parameter maintains aspect ratio, if you want exact dimensions replace null with a height number as you wish
    gm(req.file.path)
      .resize(400, null)
      .noProfile()
      .write(req.file.path, function (err) {
        if (err) {
          console.log(err);
          fs.unlink(req.file.path);
          // });// this will result a 404 when frontend tries to access the image, I ll provide a fix soon
        }
      });
    user.update({$set: {profilePic: req.file.filename}}, function (err, result) {
      if (err) {
        return res.status(404).json({
          message: 'There was an error, please try again',
          err: err
        });
      }
      res.status(201).json({
        message: 'Profile picture uploaded successfully',
        obj: result
      });
    });
  });
});

// change user password from front end form inside user's profile
router.post('/password', function (req, res, next) {
  User.findOne({_id: req.user._id}, function (err, user) {
    if (err) {
      return res.status(403).json({
        title: 'There was a problem',
        error: err
      });
    }
    if (!passwordHash.verify(req.body.currentPassword, user.password)) {
      return res.status(403).json({
        title: 'You cannot change the password',
        error: {message: 'Incorrect current password, please try again'}
      })
    } else {
      var newPassword = passwordHash.generate(req.body.newPassword);
      user.update({$set: {password: newPassword}}, function (err, result) {
        if (err) {
          return res.status(404).json({
            message: 'There was an error, please try again',
            err: err
          });
        }
        res.status(201).json({
          message: 'Password changed successfully',
          obj: result
        });
      })
    }
  });
});

module.exports = router;
