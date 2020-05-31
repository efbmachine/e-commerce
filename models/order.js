var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    owner: {type:Schema.Types.ObjectId, ref: 'User'},
    list: [{
        product:{ type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type:Number,min:0,max:20}
    }],
    price:Number,
    date:{type:Date,default: (new Date)},
    state:{type:String,default:'traitement'}
})
orderSchema.pre('save',async function(req,res,next){
    console.log('settinng up order')
    if(this.date == null){
        console.log('setting up date');
        this.date = await toDMY(new Date)
        console.log(this.date);
    }if(this.state==null){
        console.log('setting up state');
        this.state = "En Traitement"
    }
})
var Order = mongoose.model('Order',orderSchema)

var toDMY = (date)=>{
    console.log('changing date format')
    return date.getDate()+'/' +date.getMonth()+1 +'/'+date.getFullYear()
}

module.exports = Order
