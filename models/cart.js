var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    owner: {type:Schema.Types.ObjectId, ref: 'User',unique:true},
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
})

cartSchema.methods.addProduct = (product) =>{
    this.products.push(product._id)
}
cartSchema.methods.removeProduct = (product,quantity=1)=>{
    for (var i = 0; i < quantity; i++) {
        let index = this.products.indexOf(product._id);
        this.products.splice(index, 1);
    }
}
cartSchema.methods.empty = ()=>{
    this.products = []
}


var Cart = mongoose.model('Cart',cartSchema)

module.exports = Cart
