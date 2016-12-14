module.exports = {
  'database': 'mongodb://alan345:alan345@ds153677.mlab.com:53677/heroku_6f0h7zgr/vulgar-test', //'mongodb://localhost:27017/ng2_Form',
  'secret': 'SUPERsecret', // change this to a hard to guess random string. it's for jwt encryption and decryption
  'api_user': 'YOUR SENDGRID USERNAME',
  'api_key': 'YOUR SENDGRID PASSWORD',
  'jwtExpire': '72h' //set the jwtExpire in smaller period in production
};
