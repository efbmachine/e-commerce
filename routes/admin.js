var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoryController')
var product_controller = require('../controllers/productController')

/* GET home page. */
router.get('/',(req,res,next)=>{
    res.render('admin')
})
//PRODUCTS
router.get('/products', product_controller.getAll)
router.get('/product/create',product_controller.renderAddProduct)
router.post('/product/create', product_controller.addProduct)
router.get('/product/:productId',product_controller.renderOne)
// CATEGORY
router.get('/categories', category_controller.getAll)
router.get('/category/create',category_controller.renderCreate)
router.post('/category/create', category_controller.create)
router.get('/category/:categoryId',category_controller.showCategory)
// router.post('/edit/:category',category_controller.edit)
router.get('/categories/deleteAll', category_controller.deleteAll)
router.get('/products/deleteAll', product_controller.deleteAll)

// router.get('/',product_controller.getCategories)
// router.get('/subCat/:subCat', product_controller.getBySubCategory)
// router.get('/:category',product_controller.getByCategory)

module.exports = router;