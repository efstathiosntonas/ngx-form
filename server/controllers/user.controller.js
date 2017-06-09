let express = require('express'),
    User    = require('../models/user.model'),
    config  = require('../config/config'),
    fs      = require('fs'),
    fse     = require('fs-extra'),
    mkdirP  = require('mkdirp'),
    multer  = require('multer'),
    mime    = require('mime'),
    path    = require('path'),
    crypto  = require('crypto'),
    gm      = require('gm').subClass({imageMagick: true});


// this function deletes the image
let rmDir = (dirPath, removeSelf) => {
  if (removeSelf === undefined)
    removeSelf = true;
  try {
    var files = fs.readdirSync(dirPath);
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
  mkdirP(config.paths.profileImagePath + req.user._id, (err) => {
    if (err) {
      console.log(err);
    }
    fse.copy(config.paths.tmpImagePath + source, config.paths.profileImagePath + req.user._id + '/' + source)
      .then(() => {
        console.log(source);
      })
      .catch((error) => console.log(error));
  });
};

// delete the temp image from front-end
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

  // Get User Info
  getUserInfo: (req, res) => {
    User.findOne({_id: req.user._id}, function (err, user) {
      if (err) {
        return res.status(403).json({
          title: 'There was an error, please try again later',
          error: err
        });
      }
      return res.status(200).json({
        user: user
      });
    });
  },

  // Upload Image to Server Temp Folder
  uploadImage: (req, res) => {
    let userId = req.user._id;
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
            User.findById(userId, (err, user) => {
              if (err) {
                return res.status(403).json({
                  title: 'There was an error, please try again later',
                  error: err
                });
              }
              if (!user) {
                return res.status(403).json({
                  title: 'You cannot change the password',
                  error: {message: 'You do not have access rights'}
                });
              }
              if (user) {
                user.profilePic = req.file.filename;
                user.save((err, result) => {
                  if (err) {
                    return res.status(403).json({
                      title: 'There was an error, please try again later',
                      error: err
                    });
                  } else {
                    if (req.file.filename !== undefined) {
                      copyImage(req, req.file.filename);
                    }
                  }
                });
              }
            });
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

  // Change User Password via Front End (not via email)
  changePassword: (req, res) => {
    let userId = req.user._id;
    User.findById(userId, function (err, user) {
      console.log(user);
      if (err) {
        return res.status(500).json({
          title: 'There was a problem',
          error: err
        });
      }
      if (!user) {
        return res.status(403).json({
          title: 'You cannot change the password',
          error: {message: 'You do not have access rights'}
        });
      }
      else {
        user.comparePassword(req.body.currentPassword, (err, isMatch) => {
          if (err) {
            return res.status(403).json({
              title: 'There was a problem',
              error: {message: 'Your current password is wrong!'}
            });
          }
          if (!isMatch) {
            return res.status(403).json({
              title: 'There was a problem',
              error: {message: 'Your current password is wrong!'}
            });
          }
          if (isMatch) {
            let newPassword = req.body.newPassword;
            user.set('password', newPassword);
            user.save((err) => {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  err: {message: 'There was an error, please try again'}
                });
              }
              res.status(201).json({
                message: 'Your password has changed successfully!'
              });
            });
          }
        });
      }
    });
  }
};

module.exports = functions;
