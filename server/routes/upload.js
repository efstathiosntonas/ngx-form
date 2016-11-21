var express = require('express'),
    router  = express.Router(),
    fs      = require('fs'),
    multer  = require('multer'),
    mime    = require('mime'),
    path    = require('path'),
    crypto  = require("crypto"),
    config  = require('../config/config'),
    User    = require('../models/user.model'),
    Form    = require('../models/form.model'),
    gm      = require('gm').subClass({imageMagick: true}),
    jwt     = require('jsonwebtoken');

// this process does not hang the nodejs server on error
process.on('uncaughtException', function (err) {
  console.log(err);
});

// Checking if user is authenticated or not, security middleware
router.use('/', function (req, res, next) {
  var token = req.headers['authorization'];
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        code: 401,
        message: 'Authentication failed',
        error: err
      })
    }
    if (!decoded) {
      return res.status(403).json({
        code: 404,
        error: {message: 'Authentication failed, malformed jwt'}
      });
    }
    if (decoded) {
      User.findById(decoded.user._id, function (err, doc) {
        if (err) {
          return res.status(500).json({
            code: 500,
            message: 'Fetching user failed',
            err: err
          });
        }
        if (!doc) {
          return res.status(404).json({
            code: 404,
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

// setting up multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dest = 'server/uploadsFolder/' + req.user._id;  // i know, i should use dirname blah blah :)
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

// posting the form with the image to server, CAUTION: the 'fileUp' MUST match the name in our file input 'name' attribute ex. name="fileUp"
router.post('/', upload.single('fileUp'), function (req, res, err) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(500).json({
      status: 'There was an error',
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
    console.log(req.file);
    // resize middleware, just change 400 to whatever you like, the null parameter maintains aspect ratio, if you want exact dimensions replace null with a height number as you wish
    gm(req.file.path)
      .resize(400, null)
      .noProfile()
      .write(req.file.path, function (err) {
        if (err) {
          fs.unlink(req.file.path);  // this will result a 404 when frontend tries to access the image, I ll provide a fix soon
          console.log(err)
        }
      });

    var form = new Form({
      textInputOne: req.body.textInput1,
      textInputTwo: req.body.textInput2,
      imagePath: req.file.filename,
      owner: user._id
    });

    form.save(function (err, result) {
      if (err) {
        return res.status(404).json({
          message: 'There was an error, please try again',
          err: err
        });
      }
      user.forms.push(result);
      user.save();
      res.status(201).json({
        message: 'Form Saved Successfully',
        obj: result
      });
    });
  })
});

module.exports = router;


