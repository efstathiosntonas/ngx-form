var express     = require('express'),
    router      = express.Router(),
    crypto      = require("crypto"),
    nodemailer  = require('nodemailer'),
    async       = require('async'),
    sgTransport = require('nodemailer-sendgrid-transport'),
    config      = require('../config/config');

var User = require('../models/user.model');

router.post('/', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({email: req.body.email}, function (err, user) {
        if (err) {
          return res.status(403).json({
            title: 'There was an error',
            error: err
          });
        }
        if (!user) {
          return res.status(403).json({
            title: 'User not found',
            error: {message: 'Please check if your email is correct'}
          })
        }

        user.resetPasswordToken   = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var options = {
        auth: {
          //please edit the config file and add your SendGrid credentials
          api_user: config.api_user,
          api_key: config.api_key
        }
      };
      var mailer  = nodemailer.createTransport(sgTransport(options));

      var mailOptions = {
        to: user.email,
        from: 'no-reply@yourdomain.com',
        subject: 'Angular 2 Form | Password Change Request  ',
        text: 'You are receiving this email because you or someone else asked for a password reset for your account.\n\n' +
        'Please follow the link or copy paste it in your browser address bar to initiate password change:\n\n' +
        'http://' + req.headers.host + '/#/user/reset/' + token + ' (The link will remain active for one hour).\n\n' +
        'If you didnt asked for a password reset, please ignore this email, your password will remain the same\n'
      };
      mailer.sendMail(mailOptions, function (err) {
        console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        return res.status(200).json({
          message: 'Success'
        })
      });
    }
  ], function (err) {
    if (err) return next(err);
  });
});

module.exports = router;
