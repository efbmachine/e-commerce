var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var tagSchema = new Schema({
    name: String,
    // products:[{type:Schema.Types.ObjectId, ref:'Product'}]
})

tagSchema.statics.getAll = async function (){
    let tags = await this.find({},{'name':1,'_id':0})
    let rtn = [];
    tags.forEach((item, i) => {
        rtn.push(item.name)
    });

    return rtn
}

tagSchema.methods.addProduct = async function(productId){
    this.products.push(productId)
}


var Tag = mongoose.model('Tag',tagSchema)

module.exports = Tag
