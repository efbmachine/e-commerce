var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController')

/* GET home page. */
router.get('/create', product_controller.renderAddProduct)
router.post('/create', product_controller.addProduct)
router.get('/deleteAll', product_controller.deleteAll)
router.get('/:productId/', product_controller.renderOne)
router.get('/:productId/delete',product_controller.deleteOne)
router.get('/category/:category', product_controller.getByCategory)

module.exports = router;
