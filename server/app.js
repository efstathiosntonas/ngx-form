let express      = require('express'),
    path         = require('path'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    mongoose     = require('mongoose'),
    config       = require('./config/config');

let app = express();

process.on('uncaughtException', function (err) {
  console.log(err);
});

mongoose.Promise = global.Promise;  // gets rid of the mongoose promise deprecated warning
mongoose.connect(config.database);
mongoose.connection.on('open', function () {
   console.log('Mongo is connected...');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, config.paths.dist)));
app.use('/uploads', express.static(__dirname + config.paths.expressUploads));

// CORS setup
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  next();
});

// setting up route
require('./routes/routes')(app);


// catch 404 and rsforward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;

