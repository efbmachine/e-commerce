var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var CategoryModel = require('mongoose').model('Category');
var TagModel = require('mongoose').model('Tag');

var productSchema = new Schema({
    imgPath:String,
    name: String,
    description: String,
    price: Number,
    promo:Number,
    category:{type:Schema.Types.ObjectId, ref:'Category'},
    subCat:String,
    tags:[String],


    // title:  String,
    // code: String,
    // profesor: {type:Schema.Types.ObjectId, ref:'User', index:true},
    // numberOfSession: {type:Number, default:5},
    // students: [{
    //     name: String,
    //     attendance: [{date:String,present:Boolean}]
    // }]
});

productSchema.pre('remove', function(next) {

    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    // CategoryModel.exists({name:})
    // Cart.remove({})
    // Sweepstakes.remove({client_id: this._id}).exec();
    // Submission.remove({client_id: this._id}).exec();
    next();
});
productSchema.pre('save',async function(next){
    console.log(this)
    //Saving the tag if it does't exist
    await this.tags.forEach(async (item, i) => {
        if(item!='' && !await TagModel.findOne({name:item})){
            console.log('item',item);
            let tag = new TagModel({name:item.trim()})
            tag.save(err=>{
                console.log('saved tag');
                if(err) return next(err)
            })
        }
    });
    // adding the product to its category
    await CategoryModel.findById(this.category, (err, cat)=>{
        if(err) return next(new Error("La categorie n'existe pas"))
        cat.addProduct(this)
        cat.save(err=>{
            console.log('saved product to cat');
            if(err) next(err)
        })
    })
    next()
})




// var toDMY = (date)=>{
//     return date.getDate()+'/' +date.getMonth()+1 +'/'+date.getFullYear()
// }
// productSchema.methods.addStudent = function(student){
//     return this.students.push(student);
// }
//
// productSchema.methods.studentPresent = function(student,present){
//     var date = toDMY(new Date());
//     this.students.forEach(function(student){
//         if(student.name==name){
//
//         }
//     })
// }
//
// productSchema.methods.allPresent = function(){
//     var date = toDMY(new Date());
//     console.log(date)
//     this.students.forEach(function(student){
//         console.log(student.name+':'+student.attendance)
//         var here = student.attendance.includes({'date':date,'present':true});
//         var notHere = student.attendance.includes({'date':date,'present':false});
//         console.log(here)
//         console.log(notHere)
//         if(here==false && notHere==false){
//              student.attendance.push({'date':date,'present':true})
//          }
//     })
// }
//
// productSchema.methods.deleteAllStudents = function(){
//     return this.students = []
// }



var Product = mongoose.model('Product', productSchema);


module.exports = Product
