var express = require('express'),
    router  = express.Router(),
    config  = require('../config/config'),
    User    = require('../models/user.model'),
    Form    = require('../models/form.model'),
    fs      = require('fs'),
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

// deleting forms among associated files

router.delete('/:id', function (req, res, next) {
  Form.findById((req.params.id), function (err, form) {

    if (err) {
      return res.status(500).json({
        code: 500,
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
    if (form.owner != req.user._id.toString()) {
      return res.status(401).json({
        title: 'Not your form!',
        error: {message: 'Users do not match'}
      });
    }
    // finding the owner of the form and deleting the form _id from the array 'forms'
    User.findOneAndUpdate({'_id': req.user._id}, {$pull: {forms: req.params.id}}, {new: true}, function (err) {
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
});


// retrieving a single form
router.get('/edit/:id', function (req, res, next) {
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
    if (form.owner != req.user._id.toString()) {
      return res.status(401).json({
        title: 'Not your form!',
        error: {message: 'Users do not match'}
      });
    }
    res.status(200).json({
      obj: form
    });
  });
});

module.exports = router;
