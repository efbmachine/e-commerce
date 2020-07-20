var path = require('path')
var AWS = require('aws-sdk')
var ProductModel = require('mongoose').model('Product');
var CategoryModel = require('mongoose').model('Category');
var TagModel = require('mongoose').model('Tag');



const s3 = new AWS.S3();



//Display list of all products
exports.getAll  =    (req,res,next)=>{
    // if(!req.session.userId){
    //     return res.redirect('/unauthorized')
    // }
    ProductModel.find({},(err,products)=>{
        if(err) return next(err);
        // // console.log('-----------------------------------------------');
        // // console.log(products)
        // // console.log('-----------------------------------------------');
        return res.render('admin/admin_products',{products:products})
    })
}

exports.renderOne = (req,res,next)=>{
    ProductModel.findById(req.params.productId,(err, product)=>{
        if(err) next(err)
        // console.log('-----------------------------------------------');
        // console.log(product)
        // console.log('-----------------------------------------------');
        return res.render('admin/admin_product',{product:product})
    })
}

exports.renderEdit = (req,res,next)=>{
    ProductModel.findById(req.params.productId,(err, product)=>{
        if(err) next(err)
        // console.log('-----------------------------------------------');
        // console.log(product)
        // console.log('-----------------------------------------------');
        CategoryModel.find({},{name:1, subCats:1},(err,cats)=>{
            if(err) return next(err)
            // console.log('cats: ', cats)
            return res.render('admin/editProduct',{product:product, categories:cats})

        })
    })
}

exports.edit =  async (req,res,next)=>{
    let product = await  ProductModel.findById(req.params.productId)
    if(product==null){
        return next(new Error("This product Id does not exist"))
    }

    //Defining products new values
    product.name = req.body.name
    product.description = req.body.description
    product.price = req.body.price
    let tags = req.body.tags.split(',')
    tags = tags.filter(tag=>{
        return(tag !== (' '||null||''))
    })
    product.tags = tags


    var cat = req.body.category.split('.',2),
        category = cat[0],
        subCat = cat[1];

    // If the subcategory of the product changed
    if((product.subCat != subCat)){
        console.log('changing subcategory');
        let oldCat = await CategoryModel.findById(product.category)
        if(oldCat!=null){
            oldCat.removeProduct(product)
            oldCat.save()
        }
        product.category = category
        product.subCat = subCat
    }
    var image = req.files? req.files.img : null
    if(image != null){
        const params = {
            Bucket: 'glovo241images',
            Key: image.name, // File name you want to save as in S3
            Body: image.data
        };
        // Uploading files to the bucket
        s3.upload(params, function(err, data) {
            if (err) {

                return next(err);
            }
            console.log(`File uploaded successfully. `);
            product.imgPath = data.Location
            console.log('At location:'+product.imgPath);
        })
    }

    product.save(err=>{

        if(err) return next(err)
        return res.redirect(`/admin/product/${product._id}`)

    })
}

exports.renderAddProduct = (req,res,next)=>{
    CategoryModel.find({},{name:1, subCats:1},async (err,cats)=>{
        if(err) return next(err)
        //let tags = await TagModel.getAll()
        let tags = ['caffe','produit laitier']
        // console.log('tags: ',tags)
        // console.log('cats: ', cats)
        res.render('admin/newProduct', {categories:cats, tags:JSON.stringify(tags)})
    })
}

exports.addProduct =  (req,res,next)=>{
    // if(!req.session.userId){
    //     return res.redirect('/unauthorized')
    // }
    var name = req.body.name,
        description  = req.body.description,
        price  = req.body.price;
    // req.body.category = category._id+'.'+subCat
    var cat = req.body.category.split('.',2),
        category = cat[0],
        subCat = cat[1];
    var tags = req.body.tags.split(',')
    tags = tags.filter(tag=>{
        return(tag !== (' '||null||''))
    })

    //------------------------ UNCOMMENT ME AFTER TESTING ------------------
    var image = req.files.img
    // ------------- Image uploading to s3 -----------------------
    // Setting up S3 upload parameters
    const params = {
        Bucket: 'glovo241images',
        Key: image.name, // File name you want to save as in S3
        Body: image.data
    };

    // Uploading files to the bucket
    console.log('about to upload picture');
    s3.upload(params, function(err, data) {
        if (err) { return next(err);}
        console.log(`File uploaded successfully. ${data.Location}`);

         // image.mv( `${__dirname}/../public/images/${image.name}`, (err)=>{
         //     if(err) return next(err)
         // })
         var product = new ProductModel({
                                         imgPath:data.Location,
                                         name:name,
                                         description:description,
                                         price:price,
                                         category:category,
                                         subCat:subCat,
                                         tags:tags
                                     });
         product.save((err,data)=>{
             if(err) return next(err);
             console.log('saved product')
             // // console.log('data: ',data)
             return res.redirect(`/admin/product/${data._id}`);
         })
     });



}

exports.deleteAll = (req,res,next)=>{
    ProductModel.deleteMany({},(err,product) =>{
        if(err) return next(err)
        // console.log('deleted all products')
        res.redirect('/admin')
    })
}

exports.deleteOne = (req,res,next)=>{

    ProductModel.findByIdAndRemove(req.params.productId,(err,product)=>{
        if(err) return next(err)
        res.redirect(302, '/admin/products')
    })

}

exports.delete = async (req,res,next)=>{
    let products= [];
    if(req.body['products[]'].length==1){
        products.push(req.body['products[]'])
    }
    products = products.concat(req.body['products[]'])
    console.log(products);
    for await(var item of products) {
        console.log('started: '+item);
        await ProductModel.findByIdAndRemove(item,(err,product)=>{
            if(err) return next(err)
            console.log('deleted: ');

        })

    }
    console.log('out of loop');
    res.status(200)
    res.send('Effectue avec succes')
}


exports.getByCategory = (req,res,next) =>{
    ProductModel.find({category:req.params.category},(err,products)=>{
        if (err) return next(err)
        return res.render('client/index',{title:req.params.category,products:products})
    })
}

exports.getBySubCategory = (req,res,next) =>{
    ProductModel.find({subCat:req.params.subCat},(err,products)=>{
        if (err) return next(err)
        return res.render('client/index',{title:req.params.subCat,products:products})
    })
}

exports.getCategories = (req,res,next)=>{
    ProductModel.find({},{category:1},(err, cat)=>{
        // console.log(cat)
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
//             // console.log('this far')
//             return res.redirect(`/products/${req.params.id}`)
//         })
//     }
// }
