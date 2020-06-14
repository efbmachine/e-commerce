var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
    subCats:[{
        name:String,
        products:[{type:Schema.Types.ObjectId, ref:'Product'}]
    }],
})
categorySchema.statics.findByName = async function(name){
    try {
        let cat = await this.find({name:name})
        return cat
    } catch (e) {
        return null
    }

}
categorySchema.statics.getCategories = function(){
     this.find({},{name:1,subCats:1},(err, category)=>{
        if(err) return next(err)
        console.log(category)
        return category
    })
}
categorySchema.methods.addSubCategory=function(subcat) {
        console.log(this)
        return this.subCats.push(subcat)

}
categorySchema.methods.addProduct=function(product) {
    this.subCats.forEach((subcat, i) => {
        if(subcat.name == product.subCat){
            if(subcat.products.indexOf(product._id) == -1){
                console.log(`adding ${product.name} to ${subcat.name}`);
                return subcat.products.push(product._id)
            }
            else{
                console.log("Subcat already contains this product");
                return "Subcat already contains this product"
            }

        }
    });


}
categorySchema.methods.getSubCategory= async function(id){
    for (var i = 0; i < this.subCats.length; i++) {
        if (this.subCats[i]._id == id) {
            console.log('bingo')
            let cat = await this.populate({path: 'subCats.products',model:'Product'}).execPopulate()
            return cat.subCats[i]
        }
    }

}
categorySchema.methods.removeProduct= async function(product){
    this.subCats.forEach((subcat, i) => {
        if(subcat.name == product.subCat){
            let index = subcat.products.indexOf(product._id)
            if(index != -1){
                console.log(`removed ${product.name} from ${subcat.name}`);
                return subcat.products.splice(index,1)
            }
        }
    });
}
categorySchema.methods.containsProduct = async function(product){
    let rtn = this.subCats.some(function(subcat, i){
        if(subcat.name == product.subCat){
            if(subcat.products.indexOf(product._id) != -1){
                return [true,subcat.name]
            }
            else{
                return false
            }

        }
    });
    return rtn
}
var Category = mongoose.model('Category',categorySchema)

module.exports = Category
