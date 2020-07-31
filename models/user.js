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
        type:String
        // validate: [
        //     function(password) {
        //         return password && password.length > 6;
        //     }, 'Password should be longer'
        // ]
    },
    salt: {
        type: String
    },
    cart: {type:Schema.Types.ObjectId, ref: 'Cart'},
    orders: [{type:Schema.Types.ObjectId, ref: 'Orders'}],
    phoneNumber:
        {
            type:String,
            default:''

        },//String,
    address: String,
    facebookID: {
        type: Number,
        default: null
    },
    isPasswordHashed:{
        type:Boolean,
        default:false
    },
    hasPassword:{
        type:Boolean,
        default:true
    }


});

userSchema.pre('save',async function(next){
    console.log('preSave user')
    console.log('this is the user before pre: ',this)
    // console.log(this);
    if(this.hasPassword && this.isPasswordHashed==false){
        this.salt = await new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
        this.isPasswordHashed = true;
    }

    console.log('done pre save user')
    console.log('this is the user after pre: ',this)
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

userSchema.methods.authenticate = async function(password) {
    if(!this.hasPassword)
    {
        return false
     }
    console.log('authenticating');
    // console.log(this.password)
    console.log(this.password);
    let temp = await this.hashPassword(password)

    console.log(temp);
// hconsole.log(temp)
    return this.password === temp;
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
