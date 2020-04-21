var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
    subCats:[{
        name:String,
        products:[{type:Schema.Types.ObjectId, ref:'Product'}]
    }],
})

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
            console.log(subcat)
            return subcat.products.push(product._id)
        }
    });


}
categorySchema.methods.getSubCategory=function(){
    return this.subCats
}

var Category = mongoose.model('Category',categorySchema)

module.exports = Category
