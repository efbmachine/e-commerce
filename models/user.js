var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    password: {
        type:String,
        validate: [
            function(password) {
                return password && password.length > 6;
            }, 'Password should be longer'
        ]
    },
    salt: {
        type: String
    },
    cart: {type:Schema.Types.ObjectId, ref: 'Cart'},
    orders: [{type:Schema.Types.ObjectId, ref: 'Orders'}],
    phoneNumber: String,
    address: String


});

userSchema.pre('save',async function(next){
    console.log('preSave user')
    this.salt = await new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
    console.log('done pre save user')
    next();
});

// userSchema.methods.addToCart = async function(product){
//     let cart = await CartModel.findById(req.session.passport.user)
//     cart.addProduct(product)
//     cart.save()
// }
userSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000,64,'sha1').toString('base64');
};

userSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

userSchema.statics.exists = async function(email) {
    let user = await this.findOne({email:email})
    if(user === null){
        console.log('can create')
        return false
    }
    else
        return true
}

var User = mongoose.model('User', userSchema);



module.exports = User
