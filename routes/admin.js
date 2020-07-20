var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoryController')
var product_controller = require('../controllers/productController')
var order_controller = require('../controllers/orderController')
var TagModel = require('mongoose').model('Tag')
var ProductModel = require('mongoose').model('Product');
var AdminModel = require('mongoose').model('Admin');


let isLoggedIn = async (req,res,next) => {
    try {
        console.log('is he logged in');
        if(req.cookies.admin != null && (await AdminModel.findOne({_id:req.cookies.admin}))!=null){
            console.log('dose');
            next()
        }else{
            return res.render('admin/login')
            console.log(e);
        }
    } catch (e) {
        return res.render('admin/login')
        console.log(e);
    }

}
/* GET home page. */
router.get('/',isLoggedIn, (req,res,next)=>{
    // Check if login
    console.log(req.cookies);
    res.render('admin/index')

})
router.get('/createAdmin',(req, res, next)=>{
    res.render('admin/createAdmin')

})
router.post('/createAdmin', function(req, res, next){
    let admin = new AdminModel({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });
    admin.save(function (err){
        if (err) return next(err)
        res.cookie('admin',admin.username);
        res.redirect('/admin')
    })

})
router.post('/login',async(req,res,next)=>{
    console.log(req.body);
    let admin = await AdminModel.findOne({username: req.body.username});
    if(admin!=null && admin.authenticate(req.body.password)){
        res.cookie('admin',admin._id)
        res.redirect('/admin')
    }
    else{
        res.render('admin/login',{message:'Wrong username of password'})
    }


})
router.get('/logout',async(req,res,next)=>{
    res.cookie('admin',null);
    res.redirect('/admin')
})
//PRODUCTS
router.get('/products',isLoggedIn, product_controller.getAll)
router.get('/product/create', isLoggedIn, product_controller.renderAddProduct)
router.post('/product/create', isLoggedIn, product_controller.addProduct)
router.get('/product/:productId', isLoggedIn, product_controller.renderOne)
router.get('/product/:productId/delete', isLoggedIn, product_controller.deleteOne)
router.get('/product/:productId/edit', isLoggedIn, product_controller.renderEdit)
router.post('/product/:productId/edit', isLoggedIn, product_controller.edit)
router.post('/products/delete', isLoggedIn, product_controller.delete)
// CATEGORY
router.get('/categories', isLoggedIn, category_controller.getAll)
router.get('/category/create', isLoggedIn, category_controller.renderCreate)
router.post('/category/create', isLoggedIn, category_controller.create)
router.get('/category/:categoryId', isLoggedIn, category_controller.showCategory)
router.get('/category/:categoryId/edit', isLoggedIn, category_controller.renderEdit)
router.post('/category/:categoryId/edit', isLoggedIn, category_controller.edit)
router.get('/category/:categoryId/:subcategoryId', isLoggedIn, category_controller.showSubcategory)
router.get('/category/:categoryId/:subcategoryId/delete', isLoggedIn, category_controller.deleteSubcategory)


router.get('/orders', isLoggedIn, order_controller.getAll)
router.get('/order/:orderId', isLoggedIn, order_controller.getOne)
router.post('/order/:orderId/edit', isLoggedIn, order_controller.editOne)
// router.post('/edit/:category', isLoggedIn, category_controller.edit)
router.get('/categories/deleteAll', isLoggedIn, category_controller.deleteAll)
router.get('/products/deleteAll', isLoggedIn, product_controller.deleteAll)

router.get('/getTags', isLoggedIn, async (req,res,next)=>{
    console.log('getting tags')
    let result = await TagModel.getAll()
    console.log(result);
    res.send(result)
})
router.get('/deleteTags', isLoggedIn, async (req,res,next)=>{
    console.log('deleting tags')
    let result = await TagModel.remove({})
    console.log(result);
    res.redirect('/admin')
})
router.post('/search', isLoggedIn, async (req,res,next)=>{
    try {
        let results = await ProductModel.find({name:{$regex:`${req.body.search}`, $options:"i"}})
        console.log(results.length)
        if(results.length<5){
            let more = await ProductModel.find({tags:{$regex:`${req.body.search}`,$options:'i'}})
            results = results.concat(more)
        }
        return res.render('admin/admin_products',{message:req.flash(),
                                            products:results,
                                            title:`Resultat de la recherche(${req.body.search}):`
                                            })

    } catch (e) {
        return next(e)
    }
})
// router.get('/',product_controller.getCategories)
// router.get('/subCat/:subCat', product_controller.getBySubCategory)
// router.get('/:category',product_controller.getByCategory)

module.exports = router;
