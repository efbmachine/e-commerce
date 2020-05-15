var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    owner: {type:Schema.Types.ObjectId, ref: 'User'},
    list: [{
        product:{ type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type:Number,min:0}
    }]
})

cartSchema.methods.addProduct = async function (productId,quantity=1){
    let found = false
    if(!found){
        console.log(productId)
        console.log(typeof(productId))
        await this.list.forEach((item, i) => {
            console.log(item.product)
            console.log(typeof(item.product));
            if(item.product==productId||isEquivalent(productId,item.product)){
                let temp = Number(this.list[i].quantity) + Number(quantity)
                console.log('----------------------------------- update:',temp)
                this.list[i].quantity = temp
                found = true
                return true
            }
        })
    }
    if(!found){
        console.log('------------------------------- create:',)
        let item = {}
        item.product= productId
        item.quantity = quantity
        return this.list.push(item)
    }
}
cartSchema.methods.editCart = async function (products,qty){
    await this.list.forEach((item, i) => {
        try {
            products.forEach((product, j) => {
                if(item.product==product)
                    if(qty[j]==0){
                        this.list.splice(i,1)
                    }else{
                        this.list[i].quantity = qty[j]
                    }
            });
        } catch (e) {
            if(item.product==products){
                if(qty==0){
                    this.list.splice(i,1)
                }else{
                    this.list[i].quantity = qty
                }
            }
        }

    });
}
cartSchema.methods.removeProduct = (product,quantity=1)=>{

    // NEEDS TO BE DONE
    // for (var i = 0; i < quantity; i++) {
    //     let index = this.list.indexOf(product._id);
    //     this.list.splice(index, 1);
    // }
}
cartSchema.methods.empty = function(){
    this.list = []
}
cartSchema.methods.fuseWith = function(cart){
    console.log('fusing with')
    cart.list.forEach( (item, i) => {
        console.log('round #'+i);
        console.log(item.product,' times ',item.quantity)
        this.addProduct(item.product,item.quantity)
    });
}

cartSchema.statics.findByUser = async function(userId){
    return await this.findOne({owner:userId})
}

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    // If number of properties is different,
    // objects are not equivalent

    console.log('--------------a----------------')
    console.log('id' ,a['id'])
    console.log('-------------b-----------------')
    console.log('id ',b['id'])
    console.log('--------------------------------');
    // If values of same property are not equal,
    // objects are not equivalent
    if(a['id']!=undefined && b['id']!=undefined){
        if (a['id'].equals(b["id"])) {
            console.log('id same');
            return true;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return false;
}


var Cart = mongoose.model('Cart',cartSchema)

module.exports = Cart
