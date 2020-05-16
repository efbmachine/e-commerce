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
    await user.populate('cart').execPopulate()
    done(err, user);
});

passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
    },
    async function(email, password, done) {
        console.log('loggin in')
        let user = await UserModel.findOne({email:email})
        if(!user){
            return done(null,false,{message:'Ce compte n\'existe pas'})
        }
        else if(!user.authenticate(password)){
            return done(null,false,{message:'Email ou Mot de passe incorrecte'})
        }
        return done(null,user)

    }
));
module.exports = passport
