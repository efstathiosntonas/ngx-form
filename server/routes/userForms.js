var express = require('express'),
    router  = express.Router(),
    config  = require('../config/config'),
    User    = require('../models/user.model'),
    Form    = require('../models/form.model'),
    Options    = require('../models/options.model'),
    fs      = require('fs'),
    jwt     = require('jsonwebtoken');

// this process does not hang the nodejs server on error
process.on('uncaughtException', function (err) {
  console.log(err);
});

// Checking if user is authenticated or not, security middleware
// router.use('/', function (req, res, next) {
//   var token = req.headers['authorization'];
//   jwt.verify(token, config.secret, function (err, decoded) {
//     if (err) {
//       return res.status(401).json({
//         message: 'Authentication failed',
//         error: err
//       })
//     }
//     if (!decoded) {
//       return res.status(404).json({
//         title: 'Authentication Failed',
//         error: {message: 'Authentication failed, malformed jwt'}
//       });
//     }
//     if (decoded) {
//       User.findById(decoded.user._id, function (err, doc) {
//         if (err) {
//           return res.status(500).json({
//             message: 'Fetching user failed',
//             err: err
//           });
//         }
//         if (!doc) {
//           return res.status(404).json({
//             title: 'User not found',
//             error: {message: 'The user was not found'}
//           })
//         }
//         if (doc) {
//           req.user = doc;
//           next();
//         }
//       })
//     }
//   })
// });




router.get('/singleFormFromOptions/:typeOption/:namePage/:positionImage', function (req, res, next) {
  Options.findOne({}, function (err, obj) {
    if (err) {
      return res.status(403).json({
        title: 'There was a problem',
        error: err
      });
    }
    if (!obj) {
      return res.status(403).json({
        title: 'Wrong Email or Password',
        error: {message: 'Please check if your password or email are correct'}
      })
    }
    let idForm = obj[req.params.typeOption][req.params.namePage][req.params.positionImage]
    Form.findById((idForm), function (err, form) {
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

  })

  // Form.find({textInputOne: req.params.position})
  //   .sort('-updatedAt')
  //   .limit(1)
  //   .exec(function (err, form) {
  //   if (err) {
  //     return res.status(500).json({
  //       message: 'An error occured',
  //       err: err
  //     })
  //   }
  //   if (!form) {
  //     return res.status(404).json({
  //       title: 'No form founds',
  //       error: {message: 'Form not found!'}
  //     });
  //   }
  //   res.status(200).json({
  //
  //     form: form[0]
  //   });
  // });
});



// getting user forms to display them on front end
router.get('/:id', function (req, res, next) {
  User.findById(({_id: req.user._id}), function (err) {
    if (err) {
      return res.status(404).json({
        message: 'No forms found for this user',
        err: err
      })
    }
    else {
      Form.find(({owner: req.user._id}), function (err, forms) {
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
  })
});


// deleting forms among associated files
router.delete('/:id', function (req, res, next) {
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
    // checking if the owner of the form is correct
    if (form.owner != req.user._id.toString()) {
      return res.status(401).json({
        title: 'Not your form!',
        error: {message: 'Users do not match, not your form'}
      });
    }
    res.status(200).json({
      obj: form
    });
  });
});

module.exports = router;
