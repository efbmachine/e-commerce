var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var addressSchema = new Schema({
    name: String,
    user: {type:Schema.Types.ObjectId, ref: 'User'},
    city: String,
    block: String,
    info: String,

});


var Address = mongoose.model('Address', addressSchema);



module.exports = Address
