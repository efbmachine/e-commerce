var CategoryModel = require('mongoose').model('Category');

exports.getAll = (req,res,next) => {
    let cats = CategoryModel.getCategories()
    res.send(cats)
}
exports.renderCreate = (req,res,next)=>{
    res.render('newCategory')
}

exports.create = (req,res,next) => {
    var name = req.body.name,
        subcat0 = req.body.subcat0,
        subcat1 = req.body.subcat1,
        subcat2 = req.body.subcat2,
        subcat3 = req.body.subcat3,
        subcat4 = req.body.subcat4;
    console.log(req.body)
    var subcat = []
    subcat.push(subcat0,subcat1, subcat2, subcat3, subcat4)

    var category = new CategoryModel({
        name:name,
        subCat:subcat
    })
    category.save((err,data)=>{
        if(err) return next(err)
        // console.log(data)

        return res.redirect(`/category/show/${data._id}`)
    })

}

exports.showCategory = (req,res,next)=>{
    CategoryModel.findById(req.params.categoryId, (err, category)=>{
        console.log(category)
        res.render('category',{category:category})
    })
}


exports.createSubClass = (req,res,next) => {

}
