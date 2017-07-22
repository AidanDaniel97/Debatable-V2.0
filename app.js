var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var MongoStore = require('connect-mongo')(session);
var mongostore = new MongoStore({
        db: 'debatable',
        url: 'mongodb://localhost/debatable'
    });


mongoose.connect('mongodb://localhost/debatable');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var chat = require('./routes/chat');
var profile = require('./routes/profile')

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout:'layout',
  helpers: {
    ifFirst: function (index, options) {
      if((index + 1) % 4 == 1){
        return options.fn(this);//if
      } else {
        return options.inverse(this);//else
      }
    },
    ifSecond: function (index, options) {
      if((index + 1) % 4 == 2){
        return options.fn(this);//if
      } else {
        return options.inverse(this);//else
      }
    }, 
     ifFourth: function (index, options) {
        if((index + 1) % 4 == 0){
          return options.fn(this);//if
        } else {
          return options.inverse(this);//else
        }
      },
  }
}));
app.set('view engine', 'handlebars');


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    key: 'express.sid',
    store: mongostore,
    saveUninitialized: true,
    resave: true
}));
// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);
app.use('/chat', chat);
app.use('/profile',profile);



// Set Port
app.set('port', (process.env.PORT || 3000));

var server = app.listen(app.get('port'), function(){
	console.log('Server started on port '+ app.get('port'));
});



//require module - pass server
var io = require('./lib/chat_sockets').listen(server,mongostore)
