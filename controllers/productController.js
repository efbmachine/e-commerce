var path = require('path')
var AWS = require('aws-sdk')
var ProductModel = require('mongoose').model('Product');
var CategoryModel = require('mongoose').model('Category');




//AWS.config.credentials = credentials
const s3 = new AWS.S3();
const uploadFile = (file) => {
    // Read content from the file

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'glovo241images',
        Key: file.name, // File name you want to save as in S3
        Body: file.data
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        return data.Location
    });
};


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
        return res.render('products',{products:products})
    })
}

exports.renderOne = (req,res,next)=>{
    ProductModel.findById(req.params.productId,(err, product)=>{
        if(err) next(err)
        console.log('-----------------------------------------------');
        console.log(product)
        console.log('-----------------------------------------------');
        return res.render('product',{product:product})
    })
}

exports.renderEdit = (req,res,next)=>{
    ProductModel.findById(req.params.productId,(err, product)=>{
        if(err) next(err)
        console.log('-----------------------------------------------');
        console.log(product)
        console.log('-----------------------------------------------');
        CategoryModel.find({},{name:1, subCats:1},(err,cats)=>{
            if(err) return next(err)
            console.log('cats: ', cats)
            return res.render('editProduct',{product:product, categories:cats})

        })
    })
}

exports.edit = (req,res,next)=>{
    ProductModel.findById(req.params.productId,(err,product)=>{
        if(err) return next(err)
        product.name = req.body.name
        product.description = req.body.description
        product.price = req.body.price

        var cat = req.body.category.split('.',2),
            category = cat[0],
            subCat = cat[1];
        product.category = category
        var oldSubcat = product.subCat
        product.subCat = subCat

        var image = req.files? req.files.img : null
        if(image != null){
            image.mv( `${__dirname}/../public/images/${image.name}`, (err)=>{
                if(err) return next(err)
                let path = encodeURI(URL+image.name)
                product.imgPath = path
            })
        }
        product.save(err=>{
            if(err) next(err)
            console.log('product saved')
            if(oldSubcat != product.subCat){
                CategoryModel.findById(category,(err,cat)=>{
                    if(err) next(err)
                    console.log('category found')
                    cat.subCats.forEach((subCat) => {
                        if(subCat.name==oldSubcat){
                            let index = subCat.products.indexOf(product._id)
                            console.log(index)
                            subCat.products.splice(index,1)
                        }
                    });
                    cat.addProduct(product)
                    cat.save(err=>{
                        if(err) return next(err)
                        res.redirect(`/admin/product/${product._id}`)
                    })

                })
            }
            else{
                res.redirect(`/admin/product/${product._id}`)
            }
        })

    })
}

exports.renderAddProduct = (req,res,next)=>{
    CategoryModel.find({},{name:1, subCats:1},(err,cats)=>{
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
        image = req.files.img;
    // req.body.category = category._id+'.'+subCat
    var cat = req.body.category.split('.',2),
        category = cat[0],
        subCat = cat[1];


    console.log('req.files.img:',req.files.img)
    let path = uploadFile(image)
    // image.mv( `${__dirname}/../public/images/${image.name}`, (err)=>{
    //     if(err) return next(err)
    // })
    var product = new ProductModel({
                                    imgPath:path,
                                    name:name,
                                    description:description,
                                    price:price,
                                    category:category,
                                    subCat:subCat
                                });
    product.save( async (err,data)=>{
        if(err) return next(err);
        console.log('data: ',data)
        CategoryModel.findById(product.category, (err, cat)=>{
            cat.addProduct(product)
            cat.save(err=>{
                if(err) next(err)
                return res.redirect(`/admin/product/${data._id}`);
            })
        })
    })


}

exports.deleteAll = (req,res,next)=>{
    ProductModel.deleteMany({},(err,product) =>{
        if(err) return next(err)
        console.log('deleted all products')
        res.redirect('/admin')
    })
}

exports.deleteOne = (req,res,next)=>{
    ProductModel.findByIdAndRemove(req.params.productId,(err,product)=>{
        if(err) return next(err)
        res.redirect(302, '/admin/products')
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
