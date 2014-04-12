
// ------------------
// Circbend server 
// ------------------

var PRODUCTION_ENVIRONMENT = false;

// require modules

var port = 11230
  , ipaddress
  , express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , connect = require('connect')
  , fs = require('fs')
  , log4js = require('log4js')
  , passport = require('passport')
  , flash = require('connect-flash')
  , LocalStrategy = require('passport-local').Strategy
  , cookieParser = express.cookieParser('well youre a keyper')
  , sessionStore = new connect.middleware.session.MemoryStore();

// setup error logging

var logfile = 'logs/error.log';
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file',
      filename: logfile,
      maxLogSize: 1048576,
      category: 'main',
      backups: 10 }
  ],
  replaceConsole: true
});
var logger = log4js.getLogger('main');
logger.setLevel('DEBUG');
logger.warn('Circbend server restarted.');

// configure express server

app.configure(function() {
  app.use(express.compress());
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('ejs', require('ejs-locals'));
  //app.use(express.cookieParser());
  app.use(cookieParser);
  app.use(express.session({ store: sessionStore }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //app.use(express.session({ secret: 'arma virumque cano, troiae qui primus ab oris', cookie: { maxAge: 28800000 }, key: 'express.sid'}));
  app.use(flash());
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.logger());
  app.use('/assets', express.static(__dirname + '/assets'));
  app.use(app.router);
});

// ----------------
// configure routes
// ----------------

// GET's

// index page
app.get('/', function (req, res) {
  res.render('index');
});

app.use(function(req, res, next) {
	res.status(404).render('404', { message: 'Page not found.', pigeon: false });
});

// fire it up
server.listen(port);

// check the host ipaddress to determine environment
// TODO: rewrite this to use process.env.NODE_ENV

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  ipaddress = add;
  if (ipaddress == '192.168.85.246') {
  	logger.warn('Production server detected.');
  	PRODUCTION_ENVIRONMENT = true;
  } 
});
