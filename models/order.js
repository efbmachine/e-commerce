var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    owner: {type:Schema.Types.ObjectId, ref: 'User'},
    list: [{
        product:{ type: Schema.Types.ObjectId, ref: 'Product' ,unique:true},
        quantity: {type:Number,min:0,max:20}
    }],
    price:Number,
    date:Date,
    state:String
})
orderSchema.pre('save',async function(req,res,next){
    if(this.date ==null){
        let date = toDMY(new Date)
        this.date = date
    }if(this.state==null){
        this.state = "En Traitement"
    }
})
var Order = mongoose.model('Order',orderSchema)

var toDMY = (date)=>{
    return date.getDate()+'/' +date.getMonth()+1 +'/'+date.getFullYear()
}

module.exports = Order
