var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var session = require('express-session');
var flash = require('req-flash');
require('./config/mongoose');
var passport = require('./config/passport');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var categoryRouter = require('./routes/categories');
var adminRouter = require('./routes/admin')
var apiRouter = require('./routes/api')

var app = express();



app.use(fileUpload());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers['x-forwarded-proto'] !== 'https')
            return res.redirect('https://' + req.headers.host + req.url);
        else
            return next();
    } else
        return next();
});

app.use(session({
    secret: 'keyboard screen glass',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 15*60*1000
    }
    }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/product',productsRouter);
app.use('/category',categoryRouter);
app.use('/admin',adminRouter);
app.use('/api',apiRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
