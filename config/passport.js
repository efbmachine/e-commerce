var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    UserModel = require('mongoose').model('User');


passport.serializeUser(function(user, done) {
    console.log('calling serialize')
    done(null, {id:user.id,cart:user.cart});
});

passport.deserializeUser(async function(values, done) {
    console.log('calling deserialise');
    let user =  await UserModel.findById(values.id);
    let err = null
    if(user==null){
        err = new Error('No user exists')
    }
    console.log('user.cart= ',user.cart)
    await user.populate('cart').execPopulate()
    console.log('user.cart=   ',user.cart)
    done(err, user);
});

passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
    },
    function(email, password, done) {
        console.log('loggin in')
        UserModel.findOne({ email: email },async function (err, user) {
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
