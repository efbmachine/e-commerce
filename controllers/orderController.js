var OrderModel = require('mongoose').model('Order');

exports.getAll = async (req,res,next) => {
    let orders = await OrderModel.find({}).sort({_id:-1})
    res.render('admin_orders',{message:req.flash(),orders:orders})

}
exports.getOne = async (req,res,next)=>{
    let order = await OrderModel.findById(req.params.orderId)
    await order.populate({path:'list.product',model:'Product'}).execPopulate()
    await order.populate('owner','name phoneNumber address').execPopulate()
    if(order==null){
        return next(new Error('This order doen\'t exists'))
    }
    console.log(order);
    res.render('admin_order',{message:req.flash(), order:order})
}

exports.editOne = async (req,res,next)=>{
    console.log(req.body)
    let order = await OrderModel.findById(req.params.orderId)
    order.state = req.body.state
    order.save(err=>{
        if(err) return next(err)
        res.status(200)
        res.json({message:'Successfully done'})
    })

}
exports.renderCreate = (req,res,next)=>{
    res.render('newCategory')
}

// exports.create = (req,res,next) => {
//     console.log(req.body)
//     let subCats = []
//     req.body.subCats.forEach((subcat, i) => {
//         if(subcat != '')
//             subCats.push({name:subcat,products:[]})
//     });
//
//     var category = new CategoryModel({
//         name:req.body.name,
//         subCats:subCats
//     })
//     category.save((err,data)=>{
//         if(err) return next(err)
//         // console.log(data)
//
//         return res.redirect(`/admin/categories`)
//     })
//
// }
//
// exports.showCategory = (req,res,next)=>{
//     CategoryModel.findById(req.params.categoryId, (err, category)=>{
//         if(err) next(err)
//         category.populate({path: 'subCats.products',model:'Product'},(err,cat)=>{
//                 res.render('admin_category',{category:category})
//         })
//     })
// }
// exports.renderEdit = (req,res,next)=>{
//     CategoryModel.findById(req.params.categoryId, (err, category)=>{
//         if(err) next(err)
//         res.render('editCategory',{category:category})
//     })
// }
//
//
// exports.edit = (req,res,next)=>{
//     CategoryModel.findById(req.params.categoryId,(err,category)=>{
//         if(err) next(err)
//         console.log(req.body)
//         let subCats = []
//         req.body.subCats.forEach((subcat, i) => {
//             if(subcat != '')
//                 subCats.push({name:subcat,products:[]})
//         });
//         subCats.forEach((subCat, i) => {
//             if(category.subCats[i]){
//                 category.subCats[i].name = subCat.name
//             }
//             else
//                 category.subCats.push(subCat)
//         });
//         category.save(err=>{
//             if(err)next(err)
//             res.redirect(`/admin/category/${category._id}`)
//         })
//
//     })
// }
//
//
// exports.showSubcategory = (req,res,next)=>{
//     CategoryModel.findById(req.params.categoryId, (err, category)=>{
//         if(err) next(err)
//         category.populate({path: 'subCats.products',model:'Product'},(err,cat)=>{
//                 let subs = cat.subCats
//                 subs.forEach((sub, i) => {
//                     if(sub._id == req.params.subcategoryId)
//                         return res.render('admin_products',{title:sub.name,products:sub.products})
//                 });
//
//         })
//     })
// }
//
// exports.deleteSubcategory = (req,res,next)=>{
//     CategoryModel.findById(req.params.categoryId, (err, category)=>{
//         if(err) next(err)
//         category.subCats.forEach((subCat, i) => {
//             if(subCat._id==req.params.subcategoryId){
//                 category.subCats.splice(i,1)
//                 category.save((err)=>{
//                     if(err) next(err)
//                     return res.redirect(`/admin/category/${category._id}`)
//                 })
//             }
//         });
//         return next(new Error("Doesn't exitst"))
//     })
// }
//
// exports.deleteAll = (req,res,next)=>{
//     CategoryModel.deleteMany({},(err,categories) =>{
//         if(err) return next(err)
//         // console.log(product)
//         console.log('deleted all categories')
//         res.redirect('/admin')
//     })
// }
//
//
// exports.createSubClass = (req,res,next) => {
//
// }
