var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoryController')

/* GET home page. */

router.get('/create', category_controller.renderCreate)
router.post('/create', category_controller.create)
router.get('/show/:categoryId',category_controller.showCategory)


// router.post('/edit/:category',category_controller.edit)

// router.get('/',product_controller.getCategories)
// router.get('/subCat/:subCat', product_controller.getBySubCategory)
// router.get('/:category',product_controller.getByCategory)

module.exports = router;
