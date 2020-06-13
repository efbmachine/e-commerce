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
            console.log(subcat)
            return subcat.products.push(product._id)
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
categorySchema.methods.hasProduct= async function(product){
    // TO COMPLETE
}

var Category = mongoose.model('Category',categorySchema)

module.exports = Category
