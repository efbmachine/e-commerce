var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    owner: {type:Schema.Types.ObjectId, ref: 'User'},
    list: [{
        product:{ type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type:Number,min:0,max:20}
    }],
    price:Number,
    address: {
        name: String,
        city: String,
        block: String,
    },
    date:{type:Date,default: (new Date)},
    state: {
        type: String,
        enum: ['paiement','traitement','preparation','livraison','livree'],
        default: 'paiement'
    },
})
// orderSchema.pre('save',function(next){
//     // console.log('settinng up order')
//     // if(this.date == null){
//     //     console.log('setting up date');
//     //     this.date = await toDMY(new Date)
//     //     console.log(this.date);
//     // }
//
//     if(this.state==null){
//         console.log('setting up state');
//         this.state = "traitement"
//     }
//     next()
// })
var Order = mongoose.model('Order',orderSchema)

var toDMY = (date)=>{
    console.log('changing date format')
    return date.getDate()+'/' +date.getMonth()+1 +'/'+date.getFullYear()
}

module.exports = Order
