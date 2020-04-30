var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController')
var category_controller = require('../controllers/categoryController')
var CategoryModel = require('mongoose').model('Category');
var ProductModel = require('mongoose').model('Product');


/* GET home page. */
router.get('/',async(req,res,next)=>{

    let category = await CategoryModel.findByName('Alimentaire')
    res.render('index',{category:category[0]})
});

router.post('/addToCart',(req,res,next)=>{
    res.send(req.body)
})

router.post('/search',async (req,res,next)=>{
    try {
        let results = await ProductModel.find({name:{$regex:`${req.body.search}`, $options:"i"}})
        console.log(results)
        return res.render('products',{products:results, search:req.body.search})
    } catch (e) {
        return next(e)
    }
})



module.exports = router;
