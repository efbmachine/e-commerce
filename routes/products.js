var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController')
var ProductModel = require('mongoose').model('Product');


/* GET home page. */

router.get('/:productId/', async (req,res,next)=>{
    try{
        let product = await ProductModel.findById(req.params.productId)
        // console.log(product)
        if(req.user==null){
            return res.render('product',{message:req.flash(),product:product,cart:req.session.cart})
        }
        return res.render('product',{message:req.flash(),product:product,cart:req.user.cart})

    }catch(err){
        return next(err)
    }
})

module.exports = router;
