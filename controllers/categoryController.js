var CategoryModel = require('mongoose').model('Category');

exports.getAll = (req,res,next) => {
    CategoryModel.find({},(err,cats)=>{
        if(err) next(err)
        res.render('admin_categories',{cats:cats})
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
                res.render('admin_category',{category:category})
        })
    })
}
exports.renderEdit = (req,res,next)=>{
    CategoryModel.findById(req.params.categoryId, (err, category)=>{
        if(err) next(err)
        res.render('editCategory',{category:category})
    })
}


exports.edit = (req,res,next)=>{
    CategoryModel.findById(req.params.categoryId,(err,category)=>{
        if(err) next(err)
        console.log(req.body)
        let subCats = []
        req.body.subCats.forEach((subcat, i) => {
            if(subcat != '')
                subCats.push({name:subcat,products:[]})
        });
        subCats.forEach((subCat, i) => {
            if(category.subCats[i]){
                category.subCats[i].name = subCat.name
            }
            else
                category.subCats.push(subCat)
        });
        category.save(err=>{
            if(err)next(err)
            res.redirect(`/admin/category/${category._id}`)
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
                        return res.render('admin_products',{title:sub.name,products:sub.products})
                });

        })
    })
}

exports.deleteSubcategory = (req,res,next)=>{
    CategoryModel.findById(req.params.categoryId, (err, category)=>{
        if(err) next(err)
        category.subCats.forEach((subCat, i) => {
            if(subCat._id==req.params.subcategoryId){
                category.subCats.splice(i,1)
                category.save((err)=>{
                    if(err) next(err)
                    return res.redirect(`/admin/category/${category._id}`)
                })
            }
        });
        return next(new Error("Doesn't exitst"))
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
