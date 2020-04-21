var CategoryModel = require('mongoose').model('Category');

exports.getAll = (req,res,next) => {
    CategoryModel.find({},(err,cats)=>{
        if(err) next(err)
        res.render('categories',{cats:cats})
    })
}
exports.renderCreate = (req,res,next)=>{
    res.render('newCategory')
}

exports.create = (req,res,next) => {
    console.log(req.body)
    let subCats = []
    req.body.subCats.forEach((subcat, i) => {
        if(subcat != '')
            subCats.push({name:subcat,products:[]})
    });

    var category = new CategoryModel({
        name:req.body.name,
        subCats:subCats
    })
    category.save((err,data)=>{
        if(err) return next(err)
        // console.log(data)

        return res.redirect(`/admin/categories`)
    })

}

exports.showCategory = (req,res,next)=>{
    CategoryModel.findById(req.params.categoryId, (err, category)=>{
        if(err) next(err)
        category.populate({path: 'subCats.products',model:'Product'},(err,cat)=>{
                res.render('category',{category:category})
        })
    })
}
exports.showSubcategory = (req,res,next)=>{
    CategoryModel.findById(req.params.categoryId, (err, category)=>{
        if(err) next(err)
        category.populate({path: 'subCats.products',model:'Product'},(err,cat)=>{
                let subs = cat.subCats
                subs.forEach((sub, i) => {
                    if(sub._id == req.params.subcategoryId)
                        return res.render('products',{title:sub.name,products:sub.products})
                });

        })
    })
}

exports.deleteAll = (req,res,next)=>{
    CategoryModel.deleteMany({},(err,categories) =>{
        if(err) return next(err)
        // console.log(product)
        console.log('deleted all categories')
        res.redirect('/admin')
    })
}


exports.createSubClass = (req,res,next) => {

}
