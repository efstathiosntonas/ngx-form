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

// get all forms from database
router.get('/', function (req, res, next) {
  if (req.user.role[0] === "admin") {
    Form.find(({}), function (err, forms) {
      if (err) {
        return res.status(404).json({
          message: 'An error occured',
          err: err
        })
      }
      res.status(200).json({
        message: 'Success',
        forms: forms
      });
    })
  }
  else {
    return res.status(401).json({
      title: 'There was an error',
      error: {message: 'You are not the administrator'}
    })
  }

});

// get a single form to edit
router.get('/edit/:id', function (req, res, next) {
  if (req.user.role[0] === "admin") {
    Form.findById((req.params.id), function (err, form) {
      if (err) {
        return res.status(500).json({
          message: 'An error occured',
          err: err
        })
      }
      if (!form) {
        return res.status(404).json({
          title: 'No form found',
          error: {message: 'Form not found!'}
        });
      }
      res.status(200).json({
        obj: form
      });
    });
  }
});

// delete a form
router.delete('/:id', function (req, res, next) {
    if (req.user.role[0] === 'admin') {
      Form.findById((req.params.id), function (err, form) {
        if (err) {
          return res.status(500).json({
            message: 'An error occured',
            err: err
          })
        }
        if (!form) {
          return res.status(404).json({
            title: 'No form found',
            error: {message: 'Form not found!'}
          });
        }
        // finding the owner of the form and deleting the form _id from the array 'forms'
        User.findOneAndUpdate({'_id': form.owner}, {$pull: {forms: req.params.id}}, {new: true}, function (err) {
          if (err) {
            return res.status(404).json({
              title: 'An error occured',
              error: err
            })
          }
        });
        // deleting the file associated with the form from the filesystem leaving the user's folder intact
        fs.unlink('server/uploadsFolder/' + form.owner + '/' + form.imagePath);
        // deleting the form from the database
        form.remove(function (err, result) {
          if (err) {
            return res.status(500).json({
              title: 'An error occured',
              error: err
            });
          }
          res.status(200).json({
            message: 'Form is deleted',
            obj: result
          });
        })
      });
    }
  }
);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.user.role[0] === "admin") {
    Form.findById((req.params.id), function (err, form){
      if (err) {
        throw err;
      }
    var dest = 'server/uploadsFolder/' + form.owner;
    var stat = null;
    try {
      stat = fs.statSync(dest);
    }
    catch (err) {
      fs.mkdirSync(dest);
    }
    if (stat && !stat.isDirectory()) {
      throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
    }
    cb(null, dest)
  })}},
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

// updating the form with new text fields values and image from front end
router.patch('/edit/:id', upload.single('fileUp'), function (req, res, err) {
  if (req.user.role[0] === 'admin') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(500).json({
        status: 'There was an error, file size too big',
        error: err
      });
    }
    // check if the user has uploaded a new file, if he has, continue to image resize
    if (req.file != undefined) {
      gm(req.file.path)
        .resize(400, null)
        .noProfile()
        .write(req.file.path, function (err) {
          if (err) {
            fs.unlink(req.file.path);  // this will result a 404 when frontend tries to access the image, I ll provide a fix soon
            console.log(err)
          }
        });
    }

    Form.findById((req.params.id), function (err, form) {
      if (err) {
        return res.status(500).json({
          message: 'An error occured',
          err: err
        })
      }
      if (!form) {
        return res.status(404).json({
          title: 'No form found',
          error: {message: 'Form not found!'}
        });
      }
      // check if user has uploaded a new file, if he has, delete the old file
      if (req.file !== undefined) {
       fs.unlink('server/uploadsFolder/' + form.owner + '/' + form.imagePath);
      }
      form.textInputOne = req.body.textInput1;
      form.textInputTwo = req.body.textInput2;
      // check if the user has uploaded a new file, if he has, then store the image path to Mongo and replace the old one
      if (req.file !== undefined) {
        form.imagePath = req.file.filename;
      }
      form.save(function (err, result) {
        if (err) {
          return res.status(404).json({
            message: 'There was an error, please try again',
            err: err
          });
        }
        res.status(201).json({
          message: 'Form Edited Successfully',
          obj: result
        });
      });
    });
  }
});

module.exports = router;
