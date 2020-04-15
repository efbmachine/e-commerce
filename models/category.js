var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
    subCat:[String],
    product:[{type:Schema.Types.ObjectId, ref:'Product'}]
})

categorySchema.statics.getCategories = () =>{
    return this.find({},{name:1,subCat:1},(err, category)=>{
        if(err) next(err)
        console.log(category)
        return category
    })
}
categorySchema.methods.addSubCategory =(subcat) => {
        console.log(this)
        return this.subCat.push(subcat)

}
categorySchema.methods.addProduct =(product) => {
        console.log(this)
        return this.product.push(product._id)

}
categorySchema.methods.getSubCategory = () =>{
    return this.subCat
}

var Category = mongoose.model('Category',categorySchema)

module.exports = Category
