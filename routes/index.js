var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController')
var category_controller = require('../controllers/categoryController')


/* GET home page. */
router.get('/',(req,res,next)=>{
    res.send('This part is under construction')
});



module.exports = router;
