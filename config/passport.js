var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    UserModel = require('mongoose').model('User');


passport.serializeUser(function(user, done) {
  done(null, user.id,user.cart);
});

passport.deserializeUser(function(id, done) {
  UserModel.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
    },
    function(email, password, done) {
        UserModel.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }
            if (!user.authenticate(password)) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }
            return done(null, user);
        });
    }
));
module.exports = passport
