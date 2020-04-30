var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController')
var ProductModel = require('mongoose').model('Product');


/* GET home page. */

router.get('/:productId/', async (req,res,next)=>{
    try{
        let product = await ProductModel.findById(req.params.productId)
        console.log(product)
        return res.render('product',{product:product})
    }catch(err){
        return next(err)
    }
})

module.exports = router;
