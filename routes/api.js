var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/productController')
var category_controller = require('../controllers/categoryController')
var CategoryModel = require('mongoose').model('Category');
var OrderModel = require('mongoose').model('Order');
var CartModel = require('mongoose').model('Cart');
var ProductModel = require('mongoose').model('Product');
var UserModel = require('mongoose').model('User');


router.get('/getCat/:catName',async(req,res,next)=>{
    let category = await CategoryModel.findOne({name:'Alimentaire'},{'subCats.name':1, 'subCats._id':1})
    console.log(category)
    res.status(200)
    return res.json({subcats:category.subCats})
})

router.get('/getOrders/:orderStatus',async(req,res,next)=>{
    let state = req.params.orderStatus
    let orders;
    if(state=='all'){
        orders = await OrderModel.find({})
    }else{
        orders = await OrderModel.find({state:req.params.orderStatus})
    }
    console.log(orders);
    res.status(200)
    return res.send(orders)
})










module.exports = router;
