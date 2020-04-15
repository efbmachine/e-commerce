var path = require('path')
var ProductModel = require('mongoose').model('Product');
var CategoryModel = require('mongoose').model('Category');



//Display list of all products
exports.getAll  =    (req,res,next)=>{
    // if(!req.session.userId){
    //     return res.redirect('/unauthorized')
    // }
    ProductModel.find({},(err,products)=>{
        if(err) return next(err);
        // console.log('-----------------------------------------------');
        // console.log(products)
        // console.log('-----------------------------------------------');
        return res.render('index',{products:products})
    })
}

exports.getOne = (req,res,next)=>{
    ProductModel.findById(req.params.productId,(err, product)=>{
        if(err) next(err)
        console.log('-----------------------------------------------');
        console.log(product)
        console.log('-----------------------------------------------');
        return res.render('product',{product:product})
    })
}

exports.renderAddProduct = (req,res,next)=>{
    CategoryModel.find({},{name:1},(err,cats)=>{
        if(err) return next(err)
        console.log('cats: ', cats)
        res.render('newProduct', {categories:cats})
    })
}

exports.addProduct = (req,res,next)=>{
    // if(!req.session.userId){
    //     return res.redirect('/unauthorized')
    // }
    var name = req.body.name,
        description  = req.body.description,
        price  = req.body.price,
        image = req.files.img,
        category = req.body.category,
        subCat = req.body.subCat;

    // console.log(image)
    image.mv( `public/images/${image.name}`, (err)=>{
        if(err)
            return next(err)
    })
    let path = encodeURI(`http://localhost:3000/images/${image.name}`)
    var product = new ProductModel({
                                    imgPath:path,
                                    name:name,
                                    description:description,
                                    price:price,
                                    category:category,
                                    subCat:subCat
                                });
    product.save((err,data)=>{
        if(err)
            return next(err);
        // UserModel.findByIdAndUpdate(req.session.userId, { $push: {products: data._id}},(err)=>{
            //console.log(user);
        console.log(data)
        return res.redirect('/');
    })


}

exports.deleteAll = (req,res,next)=>{
    ProductModel.deleteMany({},(err,product) =>{
        if(err) return next(err)
        // console.log(product)
        res.redirect('/')
    })
}

exports.deleteOne = (req,res,next)=>{
    ProductModel.findByIdAndRemove(req.params.productId,(err,product)=>{
        if(err) return next(err)
        res.redirect('/')
    })
}

exports.getByCategory = (req,res,next) =>{
    ProductModel.find({category:req.params.category},(err,products)=>{
        if (err) return next(err)
        return res.render('index',{title:req.params.category,products:products})
    })
}

exports.getBySubCategory = (req,res,next) =>{
    ProductModel.find({subCat:req.params.subCat},(err,products)=>{
        if (err) return next(err)
        return res.render('index',{title:req.params.subCat,products:products})
    })
}

exports.getCategories = (req,res,next)=>{
    ProductModel.find({},{category:1},(err, cat)=>{
        console.log(cat)
        res.send(cat)
    })
}



// exports.showProduct = (req,res,next)=>{
//     if(!req.session.userId){
//         return res.redirect('/unauthorized')
//     }
//     ProductModel.findOne({profesor:req.session.userId, code:req.params.id}, (err,product)=>{
//         req.session.productId = product._id
//         return res.render('product', {name:req.session.name,product:product})
//     })
// }
//
// exports.createStudent = (req,res,next)=>{
//     if(!req.session.userId){
//         return res.redirect('/unauthorized')
//     }
//     if(req.session.productId){
//         var student = {name:req.body.name};
//         ProductModel.findById(req.session.productId,(err,product)=>{
//             if(err) return next(err)
//             product.addStudent(student);
//             product.allPresent();
//             product.save();
//             return res.redirect(`/products/${req.params.id}`)
//         })
//     }
// }
//
// exports.deleteAllStudents = (req,res,next)=>{
//     if(!req.session.userId){
//         return res.redirect('/unauthorized')
//     }
//     if(req.session.productId){
//         ProductModel.findById(req.session.productId,(err,product)=>{
//             if(err) return next(err)
//             product.deleteAllStudents()
//             product.save();
//             console.log('this far')
//             return res.redirect(`/products/${req.params.id}`)
//         })
//     }
// }
