var express = require('express'),
    router  = express.Router(),
    config  = require('../config/config'),
    User    = require('../models/user.model'),
    Form    = require('../models/form.model'),
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
      return res.status(404).json({
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

// getting user forms to display them on front end
router.get('/:id', function (req, res, next) {
  User.findById(({_id: req.user._id}), function (err) {
    if (err) {
      return res.status(404).json({
        code: 404,
        message: 'No forms found for this user',
        err: err
      })
    }
    else {
      Form.find(({owner: req.user._id}), function (err, forms) {
        if (err) {
          return res.status(404).json({
            code: 404,
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
  })
});

module.exports = router;
