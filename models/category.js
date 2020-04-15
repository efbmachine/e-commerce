var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
    subCat:[String],
    product:[{type:Schema.Types.ObjectId, ref:'Product'}]
})

categorySchema.statics.getCategories = function(){
     this.find({},{name:1,subCat:1},(err, category)=>{
        if(err) return next(err)
        console.log(category)
        return category
    })
}
categorySchema.methods.addSubCategory=function(subcat) {
        console.log(this)
        return this.subCat.push(subcat)

}
categorySchema.methods.addProduct=function(product) {
        console.log(this)
        return this.product.push(product._id)

}
categorySchema.methods.getSubCategory=function(){
    return this.subCat
}

var Category = mongoose.model('Category',categorySchema)

module.exports = Category
