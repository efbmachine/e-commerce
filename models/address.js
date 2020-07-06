var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var addressSchema = new Schema({
    name: String,
    user: {type:Schema.Types.ObjectId, ref: 'User'},
    city: String,
    block: String,
    active:Boolean

});


addressSchema.pre('save',function(next){

    next()
})


var Address = mongoose.model('Address', addressSchema);




module.exports = Address
