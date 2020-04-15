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
    var category = new CategoryModel(req.body)
    category.save((err,data)=>{
        if(err) return next(err)
        // console.log(data)

        return res.redirect(`/admin/categories`)
    })

}

exports.showCategory = (req,res,next)=>{
    CategoryModel.findById(req.params.categoryId, (err, category)=>{
        console.log(category)
        res.render('category',{category:category})
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
