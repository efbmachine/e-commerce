var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController')

/* GET home page. */
router.get('/',product_controller.getAll);

router.get('/deleteAll', product_controller.deleteAll)

module.exports = router;
