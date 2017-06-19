module.exports = {
  'database' : 'mongodb://localhost:27017/ngx_forms',
  'secret'   : 'SUPERsecret', // change this to a hard to guess random string. it's for jwt encryption and decryption
  'api_user' : 'YOUR_SENDGRID_USERNAME',
  'api_key'  : 'YOUR_SENDGRID_PASSWORD',
  'jwtExpire': '72h', //set the jwtExpire in smaller period in production
  'paths'    : {
    // path for pets images
    serverPath      : '../server/app',
    imagePath       : 'server/uploads/forms/',
    profileImagePath: 'server/uploads/profiles/',
    tmpImagePath    : 'server/uploads/tmp/',
    dist            : '../dist',
    expressUploads  : '/uploads',
    emailPath       : 'server/views/email_templates/',
  }
};
