var express = require('express'),
    router = express.Router(),
    crypto = require("crypto"),
    nodemailer = require('nodemailer'),
    async = require('async'),
    sgTransport = require('nodemailer-sendgrid-transport'),
    passwordHash = require('password-hash'),
    config = require('../config/config');

var User = require('../models/user.model');


 // getting token from email and checking if it's valid
router.get('/:token', function(req, res) {
  var token = req.params.token;
  User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if(err) {
      return res.status(403).json({
        title: 'An error occured',
        error: err
      });
    }
    if(!user) {
      return res.status(403).json({
        title: 'Password cannot be changed!',
        error: {message: 'Password reset token is invalid or has expired.'}
      })
    }
    return res.status(200).json({
      message: 'Success',
      token: token
    })
  });

});

// after getting token from email, check if it's still valid and then proceed in password reset by
// getting the user new password, hashing it and then reset the passwordToken and passwordExpires fields to undefined

router.post('/:token', function(req, res) {
  async.waterfall([
    function(done) {
      var token = req.params.token;
      User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if(err) {
          return res.status(403).json({
            title: 'An error occured',
            error: err
          });
        }
        if(!user) {
          return res.status(403).json({
            title: 'There was an error',
            error: {message: 'Please check if your email is correct'}
          })
        }
        user.password = passwordHash.generate(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          done(err, user);
        });
      });
    },

    // sending notification email to user that his password has changed
    function(user, done) {
      var options = {
        auth: {
          api_user: config.api_user,
          api_key:  config.api_key
        }
      };
      var mailer = nodemailer.createTransport(sgTransport(options));

      var mailOptions = {
        to: user.email,
        from: 'no-reply@yourdomain.com',
        subject: 'Angular 2 Form | Password Changed!',
        text: 'Hello,\n\n' +
        'This email has been sent to you to inform you that the password for the acount ' + user.email + ' has been changed.\n'
      };
      mailer.sendMail(mailOptions, function(err) {
        console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        return res.status(200).json({
          message: 'Success'
        })
      });
    }
  ], function(err) {
    if (err) {
    }
  });
});

module.exports = router;
