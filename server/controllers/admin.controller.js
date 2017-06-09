let express = require('express'),
    fs      = require('fs'),
    fse     = require('fs-extra'),
    multer  = require('multer'),
    mime    = require('mime'),
    path    = require('path'),
    crypto  = require('crypto'),
    mkdirP  = require('mkdirp'),
    config  = require('../config/config'),
    User    = require('../models/user.model'),
    Form    = require('../models/form.model'),
    gm      = require('gm').subClass({imageMagick: true});


process.on('uncaughtException', function (err) {
  console.log(err);
});

let rmDir = (dirPath, removeSelf) => {
  if (removeSelf === undefined)
    removeSelf = true;
  try {
    let files = fs.readdirSync(dirPath);
  }
  catch (e) {
    return;
  }
  if (files.length > 0)
    for (let i = 0; i < files.length; i++) {
      let filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
    }
  if (removeSelf)
    fs.rmdirSync(dirPath);
};

// create a Temp storage for images, when the user submits the form, the temp image will be moved to the appropriate folder inside /uploads/forms/user_id/photo.jpg
let tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = config.paths.tmpImagePath;
    let stat = null;
    try {
      stat = fs.statSync(dest);
    }
    catch (err) {
      fs.mkdirSync(dest);
    }
    if (stat && !stat.isDirectory()) {
      throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
    }
    cb(null, dest);
  },
  filename   : (req, file, cb) => {
    // if you want even more random characters prefixing the filename then change the value '2' below as you wish, right now, 4 charaters are being prefixed
    crypto.pseudoRandomBytes(4, (err, raw) => {
      let filename = file.originalname.replace(/_/gi, '');
      cb(null, raw.toString('hex') + '.' + filename.toLowerCase());
    });
  }
});

//  multer configuration
let uploadTemp = multer({
  storage   : tempStorage,
  limits    : {
    fileSize: 5000000, // 5MB filesize limit
    parts   : 1
  },
  fileFilter: (req, file, cb) => {
    let filetypes = /jpe?g|png/;
    let mimetype = filetypes.test(file.mimetype);
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: File upload only supports the following filetypes - ' + filetypes);
  }
}).single('fileUp');

// When user submits the form, the temp image is copied to /uploads/forms/user_id/photo.jpg
let copyImage = (req, source) => {
  mkdirP(config.paths.imagePath + req.user._id, (err) => {
    if (err) {
      console.log(err);
    }
    fse.copy(config.paths.tmpImagePath + source, config.paths.imagePath + req.user._id + '/' + source)
      .then(() => {
      })
      .catch((error) => console.log(error));
  });
};

let deleteImage = (image) => {
  fse.remove(config.paths.tmpImagePath + image)
    .then(() => {
      console.log('success!');
    })
    .catch(err => {
      console.error(err);
    });
};

let functions = {

  // Upload Image to Server Temp Folder
  uploadImage: (req, res) => {
    uploadTemp(req, res, (err) => {
      if (err) {
        console.log(err);
      }
      if (req.file !== undefined) {
        gm(req.file.path)
          .resize(445, null)
          .noProfile()
          .write(req.file.path, (err) => {
            if (err) {
              console.log(err);
              res.status(500).json({
                message: 'The file you selected is not an image'
              });
            }
            res.status(201).json(req.file.filename);
          });
      }
    });
  },

  // Delete Temporary Image From Temp Folder
  deleteImage: (req, res) => {
    let params = req.params.id;
    deleteImage(params);
    res.status(200).json({
      message: 'Image deleted successfully!'
    });
  },

  // Add New Form
  newForm: (req, res) => {
    User.findById(req.user._id, function (err, user) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          err  : err
        });
      }

      let form = new Form({
        textInputOne: req.body.textInputOne,
        textInputTwo: req.body.textInputTwo,
        imagePath   : req.body.fileUp,
        owner       : user._id
      });

      form.save(function (err, result) {
        if (err) {
          return res.status(404).json({
            message: 'There was an error, please try again',
            err    : err
          });
        }
        copyImage(req, req.body.fileUp);
        user.forms.push(result);
        user.save();
        res.status(201).json({
          message: 'Form Saved Successfully',
          obj    : result
        });
      });
    });
  },

  // get all forms from database
  getAllForms: (req, res) => {
    if (req.user.role[0] === 'admin') {
      Form.find(({}), function (err, forms) {
        if (err) {
          return res.status(404).json({
            message: 'An error occured',
            err    : err
          });
        }
        res.status(200).json({
          message: 'Success',
          forms  : forms
        });
      });
    }
    else {
      return res.status(401).json({
        title: 'There was an error',
        error: {message: 'You are not the administrator'}
      });
    }
  },

  // Get Single Form
  getSingleForm: (req, res) => {
    if (req.user.role[0] === 'admin') {
      Form.findById((req.params.id), function (err, form) {
        if (err) {
          return res.status(500).json({
            message: 'An error occured',
            err    : err
          });
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
  },

  // Delete Single Form
  deleteSingleForm: (req, res) => {
    if (req.user.role[0] === 'admin') {
      Form.findById((req.params.id), function (err, form) {
        if (err) {
          return res.status(500).json({
            message: 'An error occured',
            err    : err
          });
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
            });
          }
        });
        // deleting the file associated with the form from the filesystem leaving the user's folder intact
        fs.unlink('server/uploads/forms/' + form.owner + '/' + form.imagePath);
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
            obj    : result
          });
        });
      });
    }
  },

  // Edit Form
  editForm: (req, res) => {
    console.log(req.body)
    if (req.user.role[0] === 'admin') {
      let formId = req.params.id;
      Form.findOne({'_id': formId}, (err, form) => {
        if (err) {
          return res.status(500).json({
            message: 'There was an error, please try again',
            err    : err
          });
        }
        if (req.body.fileUp !== undefined) {
          var image = req.body.fileUp;
        } else {
          image = form.imagePath;
        }
        Form.findOneAndUpdate({'_id': formId}, {
          $set: {
            textInputOne: req.body.textInputOne,
            textInputTwo: req.body.textInputTwo,
            imagePath   : image
          }
        }, {new: true}, (err, form) => {
          if (err) {
            return res.status(500).json({
              message: 'There was an error, please try again',
              err    : err
            });
          }
          if (!form) {
            return res.status(404).json({
              title: 'No form found',
              error: {message: 'Form not found!'}
            });
          }
          // check if user has uploaded a new file, if he has, delete the old file
          // if (req.body.filePath !== undefined) {
          //   fs.unlink('server/uploads/forms/' + form.owner + '/' + form.imagePath);
          // }
          // check if the user has uploaded a new file, if he has, then store the image path to Mongo and replace the old one
          if (req.body.fileUp !== undefined) {
            copyImage(req, req.body.fileUp);
          }
          res.status(201).json({
            message: 'Form Edited Successfully',
            obj    : form
          });
        });
      });
    }
  }
};

module.exports = functions;

