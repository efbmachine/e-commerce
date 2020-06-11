var mongoose = require('mongoose')
var Schema = mongoose.Schema;
// var UserModel = require('mongoose').model('User');


var tagSchema = new Schema({
    name: String
})

tagSchema.statics.getAll = async function (){
    let tags = await this.find({})
    return tags
}

var Tag = mongoose.model('Tag',tagSchema)

module.exports = Tag
// cartSchema.methods.addProduct = async function (productId,quantity=1){
//     let found = false
//     if(!found){
//         console.log(productId)
//         await this.list.forEach(async(item, i) => {
//             console.log(item.product)
//             console.log(typeof(item.product));
//             if(item.product==productId||isEquivalent(productId,item.product)){
//                 let temp = Number(this.list[i].quantity) + Number(quantity)
//                 console.log('----------------------------------- update:',temp)
//                 this.list[i].quantity = temp
//                 found = true
//                 await this.updateCount()
//                 return true
//             }
//         })
//     }
//     if(!found){
//         console.log('------------------------------- create:',)
//         let item = {}
//         item.product= productId
//         item.quantity = quantity
//         this.list.push(item)
//         return this.updateCount()
//     }
//
// }
// cartSchema.methods.editCart = async function (products,qty){
//     console.log('products,qty',products,qty)
//     await this.list.forEach((item, i) => {
//         try {
//             products.forEach((product, j) => {
//                 if(item.product==product){
//                     if(qty[j]==0){
//                         this.list.splice(i,1)
//                     }else{
//                         this.list[i].quantity = qty[j]
//                     }
//                 }
//             });
//         } catch (e) {
//             if(item.product==products){
//                 if(qty==0){
//                     this.list.splice(i,1)
//                 }else{
//                     this.list[i].quantity = qty
//                 }
//             }
//         }
//
//     });
//     this.updateCount()
//
// }
// cartSchema.methods.removeProduct = (product,quantity=1)=>{
//     this.list.forEach((item, i) => {
//         if(item.product==product){
//             if(quantity>=item.quatity){
//                 this.list.splice(i,1)
//             }else{
//                 this.list[i].quantity = - quantity
//             }
//         }
//     });
//     this.updateCount()
//
//
//     // NEEDS TO BE DONE
//     // for (var i = 0; i < quantity; i++) {
//     //     let index = this.list.indexOf(product._id);
//     //     this.list.splice(index, 1);
//     // }
// }
// cartSchema.methods.empty = function(){
//     this.list = []
//     this.numOfProducts =0
// }
// cartSchema.methods.fuseWith = function(cart){
//     console.log('fusing with')
//     cart.list.forEach( (item, i) => {
//         console.log('round #'+i);
//         console.log(item.product,' times ',item.quantity)
//         this.addProduct(item.product,item.quantity)
//     });
//     this.updateCount
// }
// cartSchema.methods.updateCount = async function() {
//     console.log('started counting');
//     let count = 0
//     await this.list.forEach((item, i) => {
//         console.log(item.quantity)
//         count += item.quantity
//     });
//     console.log(count)
//     this.numOfProducts = count
//
// }
// cartSchema.statics.findByUser = async function(userId){
//     return await this.findOne({owner:userId})
// }
//
// cartSchema.post('save',async function(next){
//     let user = await UserModel.findById(this.owner)
//     if(user!=null){
//         user.cart = this._id
//         await user.save()
//     }
// })
//
//
// function isEquivalent(a, b) {
//     // Create arrays of property names
//     var aProps = Object.getOwnPropertyNames(a);
//     var bProps = Object.getOwnPropertyNames(b);
//
//     if(a['id']!=undefined && b['id']!=undefined){
//         if (a['id'].equals(b["id"])) {
//             console.log('id same');
//             return true;
//         }
//     }
//
//     return false;
// }
//
