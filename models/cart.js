var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    owner: {type:Schema.Types.ObjectId, ref: 'User',unique:true},
    list: [{
        product:{ type: Schema.Types.ObjectId, ref: 'Product' ,unique:true},
        quantity: {type:Number,min:0,max:20}
    }]
})

cartSchema.methods.addProduct = async function (productId,quantity=1){
    let done = false
    await this.list.forEach((item, i) => {
        if(item.product==productId){
            let temp = Number(this.list[i].quantity) + Number(quantity)
            console.log('----------------------------------- update:',temp)
            this.list[i].quantity = temp
            done = true
            return true
        }
    });
    if(!done){
        console.log('------------------------------- create:',)
        let item = {}
        item.product= productId
        item.quantity = quantity
        return this.list.push(item)
    }
}
cartSchema.methods.removeProduct = (product,quantity=1)=>{

    // NEEDS TO BE DONE
    // for (var i = 0; i < quantity; i++) {
    //     let index = this.list.indexOf(product._id);
    //     this.list.splice(index, 1);
    // }
}
cartSchema.methods.empty = ()=>{
    this.list = []
}

cartSchema.statics.findByUser = function(userId){
    this.find({owner:userId},(err,cart)=>{
        console.log(cart)
        if(err) return next(err)
        return cart
    })
}

var Cart = mongoose.model('Cart',cartSchema)

module.exports = Cart
