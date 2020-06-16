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
    provider:String,
    tags:[{
        type:String,
        trim:true,
        lowercase:true
    }],


    // title:  String,
    // code: String,
    // profesor: {type:Schema.Types.ObjectId, ref:'User', index:true},
    // numberOfSession: {type:Number, default:5},
    // students: [{
    //     name: String,
    //     attendance: [{date:String,present:Boolean}]
    // }]
});

productSchema.pre('remove', async function(next) {
    // removing the product to its category
    await CategoryModel.findById(this.category, (err, cat)=>{
        if(err) return next(new Error("La categorie n'existe pas"))
        cat.removeProduct(this)
        cat.save(err=>{
            console.log('removed product from cat');
            if(err) next(err)
        })
    })
    next();
})
productSchema.pre('save',async function(next){

    let TAGS = await TagModel.getAll()
    //Saving the tag if it does't exist
    console.log(TAGS);
    this.tags.forEach((item, i) => {


        let index = TAGS.indexOf(item)
        console.log('index:'+index);
        if(index == -1 && item.trim()!==''){
            let tag = new TagModel({name:item.trim()})
            tag.save(err=>{
                if(err) return next(err)
                console.log(`tag ${item} saved`);
            })
        }
    });




        // console.log('------------------------------------------');
        // let tagOg = await TagModel.findOne({name:item})
        // console.log('item:'+item);
        // console.log('tag:'+tagOg);
        // if(item.trim() !='' && tagOg == null){
        //     console.log('creating tag');
        //     let tag =  new TagModel({name:item.trim()})
        //     console.log('tag:'+tag);
        //     tag.save(err=>{
        //         if(err){
        //             console.log(err);
        //             return next(err)
        //          }
        //          console.log('tag created');
        //     })
        // }
        // console.log('------------------------------------------');
        // await waitFor(500)
        //
        //


    // adding the product to its category
    let cat = await CategoryModel.findById(this.category)
    if(cat==null) return next(new Error("La categorie n'existe pas"))
    let inside = await cat.containsProduct(this)
    if(inside==false){
        cat.addProduct(this)
        cat.save(err=>{
            if(err) next(err)
        })
    }

    next()
})

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));


let  asyncForEach = async(arr, cb)=> {
    for (var i = 0; i < arr.length; i++) {
        await cb(arr[i],i,arr)
    }

}


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
