var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    multer = require('multer'),
    mime = require("mime"),
    path = require('path'),
    crypto = require("crypto");

process.on('uncaughtException', function(err) {
  console.log(err);
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dest = 'server/uploadsFolder';
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
    cb(null, dest )
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(2, function (err, raw) {
      cb(null, raw.toString('hex') + '.' + file.originalname);
    });
  }
});


var upload = multer({storage: storage});



module.exports = router;


