var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    UserModel = require('mongoose').model('User');


passport.serializeUser(function(user, done) {
    console.log('calling serialize')
    done(null, {id:user.id,cart:user.cart,name:user.name});
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
        else{
            let authentication = await user.authenticate(password)
            if(!authentication){
                console.log('authentication failed');
                return done(null,false,{message:'Email ou Mot de passe incorrecte'})
            }
        }
        console.log('authentication successfull');
        return done(null,user)

    }
));

passport.use(new FacebookStrategy({
    clientID: 901129653708849,
    clientSecret: 'b9a9802675403649fa0fd1869f45c29e',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'photos','email']
  },
    async function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        var facebookID = profile.id,
            name = profile.displayName,
            email = profile._json.email;
        let user = await UserModel.findOne({facebookID:facebookID})
        if(user==null){
            user = await UserModel.findOne({email:email})
            if(user!=null){
                user.facebookID = facebookID
                user.save(err=>{
                    if(err) {return done(err)}
                    return done(null,user)
                })
            }
            else{
                user = new UserModel( {facebookID:facebookID,name:name,email:email,password:facebookID,hasPassword:false} )
                user.save(err=>{
                    if(err) {return done(err)}
                    return done(null,user)
                })
            }
        }
        else{
            return done(null,user);
        }
    }
));
module.exports = passport
