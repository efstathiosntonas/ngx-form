var express = require('express'),
    router  = express.Router(),
    config  = require('../config/config'),
    User    = require('../models/user.model'),
    Companie    = require('../models/companie.model'),
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
      User.findById(decoded.user._id, function (err, doc) {
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
          req.user = doc;
          next();
        }
      })
    }
  })
});



//update
router.put('/:id', function (req, res, next) {
  Companie.findById(({_id: req.params.id}), function (err, item) {
    if (err) {
      return res.status(404).json({
        message: 'No forms found for this user',
        err: err
      })
    } else {
      //  item = req.body;
        item.address = req.body.address;
        item.text = req.body.text;
        item.region_id = req.body.region_id;

        item.save(function (err, result) {
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

    }
  })
});

router.post('/', function (req, res, next) {
  var companie = new Companie(req.body);
  companie.save(function (err, result) {
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



// get all forms from database
router.get('/page/:page', function (req, res, next) {
  var itemsPerPage = 5;
  var currentPage = Number(req.params.page);
  var pageNumber = currentPage - 1;
  var skip = (itemsPerPage * pageNumber);
  var limit = (itemsPerPage * pageNumber) + itemsPerPage;



  Companie.find().count((err, totalItems) => {
    if(err)
      res.send(err);
    else
        Companie.aggregate(
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
  Companie.findById(({_id: req.params.id}), function (err, item) {
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


router.delete('/:id', function (req, res, next) {
  Companie.findById((req.params.id), function (err, item) {

    if (err) {
      return res.status(500).json({
        message: 'An error occured',
        err: err
      })
    }
    if (!item) {
      return res.status(404).json({
        title: 'No form found',
        error: {message: 'Form not found!'}
      });
    }


    // deleting the form from the database
    item.remove(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      res.status(200).json({
        message: 'Item is deleted',
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
