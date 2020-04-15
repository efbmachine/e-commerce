var mongoose = require('mongoose');
var Schema = mongoose.Schema;
db = mongoose.connection;

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
        required: [true,"can't be blank"],
    },
    courses: [{type:Schema.Types.ObjectId, ref: 'Course'}]
});

userSchema.pre('save',(next)=>{
    next()
});


var User = mongoose.model('User', userSchema);



module.exports = User
