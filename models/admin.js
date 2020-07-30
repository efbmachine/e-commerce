var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var adminSchema = new Schema({
    firstName: String,
    lastName: String,
    username:{
        type: String,
        unique: true,
        index:true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
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
    isPasswordHashed:{
        type:Boolean,
        default:false
    },
    permissions:[{
        type:String,
        // enum:['CRUD all','orders Read','products Read',]
    }]

});

adminSchema.pre('save',async function(next){
    if(this.isPasswordHashed==false){
        this.salt = await new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
        this.isPasswordHashed = true;
    }
    next();
});

// userSchema.methods.addToCart = async function(product){
//     let cart = await CartModel.findById(req.session.passport.user)
//     cart.addProduct(product)
//     cart.save()
// }
adminSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000,64,'sha1').toString('base64');
};

adminSchema.methods.authenticate = async function(password) {
    console.log('authenticating');
    // console.log(this.password)
    let temp = await this.hashPassword(password)
// hconsole.log(temp)
    return this.password === temp;
};

adminSchema.statics.exists = async function(userName) {
    let user = await this.findOne({username:userName})
    if(user === null){
        return false
    }
    else
        return true
}

var Admin = mongoose.model('Admin', adminSchema);



module.exports = Admin
