let schedule       = require('node-schedule'),
    findRemoveSync = require('find-remove');

console.log('fired');
schedule.scheduleJob('00 * * * *', function () {
  let result = findRemoveSync(__dirname + '/uploads/tmp', {age: {seconds: 3600}, extensions: ['.jpg', '.png', '.jpeg', '.JPEG', '.JPG']});
  console.log(result);
});
