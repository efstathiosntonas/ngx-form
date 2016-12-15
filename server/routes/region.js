var express = require('express'),
    router  = express.Router(),
    config  = require('../config/config'),
    fs      = require('fs'),
    jwt     = require('jsonwebtoken');
    Region    = require('../models/region.model'),

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
        message: 'Authentication failed',
        error: err
      })
    }
    if (!decoded) {
      return res.status(404).json({
        title: 'Authentication Failed',
        error: {message: 'Authentication failed, malformed jwt'}
      });
    }
    if (decoded) {
      Region.find( function (err, doc) {
        if (err) {
          return res.status(500).json({
            message: 'Fetching user failed',
            err: err
          });
        }
        if (!doc) {
          return res.status(404).json({
            title: 'User not found',
            error: {message: 'The user was not found'}
          })
        }
        if (doc) {
          req.region = doc;
          next();
        }
      })
    }
  })
});


// get all forms from database
router.get('/page/:page', function (req, res, next) {
  var itemsPerPage = 5;
  var currentPage = Number(req.params.page);
  var pageNumber = currentPage - 1;
  var skip = (itemsPerPage * pageNumber);
  var limit = (itemsPerPage * pageNumber) + itemsPerPage;



      Region.find().count((err, totalItems) => {
        if(err)
          res.send(err);
        else
            Region.aggregate(
            [
              { $skip : skip },
              { $limit : itemsPerPage }

            ], function(err, data) {
                 if (err) {
                   res.send(err);
                 }
                 else {
                   var jsonOb =
                    {
                      "paginationData" : {
                        "totalItems": totalItems,
                        "currentPage" : currentPage,
                        "itemsPerPage" : itemsPerPage
                      },
                      "data": data
                    };

                   res.send(jsonOb);
                 }
               }
            );

      });

});




// getting user forms to display them on front end
router.get('/:id', function (req, res, next) {
  Region.findById(({_id: req.params.id}), function (err, item) {
    if (err) {
      return res.status(404).json({
        message: 'No forms found for this user',
        err: err
      })
    }
    else {
      res.status(200).json({
        message: 'Success',
        item: item
      });
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
