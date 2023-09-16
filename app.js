const dotenv = require('dotenv').config()
console.log(dotenv);
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('req-flash');
const db = require('./config/mongoose');
const passport = require('./config/passport');



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoryRouter = require('./routes/categories');
const adminRouter = require('./routes/admin')
const apiRouter = require('./routes/api')

const app = express();



app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'keyboard screen sunglasses',
    store: new MongoStore({ mongooseConnection: db }),
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
        secure: 'auto',
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
