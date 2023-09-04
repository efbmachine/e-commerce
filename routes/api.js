var express = require('express');
var connectEnsureLogin = require('connect-ensure-login');
var nodemailer = require('nodemailer');
var router = express.Router();
var product_controller = require('../controllers/productController')
var category_controller = require('../controllers/categoryController')
var CategoryModel = require('mongoose').model('Category');
var OrderModel = require('mongoose').model('Order');
var CartModel = require('mongoose').model('Cart');
var ProductModel = require('mongoose').model('Product');
var UserModel = require('mongoose').model('User');
var AddressModel = require('mongoose').model('Address');

var passport = require('../config/passport')


router.get('/getCat/:catName',async(req,res,next)=>{
    try {
        let category = await CategoryModel.findOne({name:'Alimentaire'},{'subCats.name':1, 'subCats._id':1})
        res.status(200)
        return res.json({subcats:category.subCats}) 
    } catch (error) {
        return next()
    }
   
})
router.get('/updateCart/:productID/:quantity',async(req,res,next)=>{
    let cartId = req.session.cart || req.user.cart

})
router.get('/getOrders/:orderStatus',async(req,res,next)=>{
    let state = req.params.orderStatus
    let orders;
    if(state=='all'){
        orders = await OrderModel.find({})
    }else{
        orders = await OrderModel.find({state:req.params.orderStatus})
    }
    res.status(200)
    return res.send(orders)
})

router.post('/addToCart/', async(req,res,next)=>{
    let cart
    //  If logged not in
    if(req.session.passport==null){
        // if don't have cart yet
        if(req.session.cart==null){
            console.log('create new cart');
            cart = await new CartModel()
            req.session.cart = cart._id
        }
        // if have a cart already
        else{
            console.log('looking 4 cart of not user');
            cart = await CartModel.findById(req.session.cart)
        }
    }

    else if(req.user!=null){
        console.log('looking 4 cart of a user');
        cart = await CartModel.findOne({owner:req.session.passport.user.id})
        if(cart==null){
            console.log('creating new cart for user')
            cart = await new CartModel()
            cart.owner = req.session.passport.user.id
            console.log('created the cart')
        }
    }
    else{
        res.status(500)
        res.json({'msg':"Veuillez reesayer."})
    }
    let product = (req.body.productId),
        qty = req.body.qty;
    cart.addProduct(product,qty)
    cart.save((err)=>{
            if(err) {
                res.status(500)
                res.json({'msg':"Le produit n'a pas pu etre rajouter. Veuillez reesayer."})
                return console.log(err)
            }
            res.status(200)
            return res.json({'msg':"Le produit a ete ajouter avec succes"})
        })

})

// router.post('/removeFromCart/:productID/:quantity', async(req,res,next)=>{
//     let cartId = req.session.cart || req.user.cart._id
//     let cart
//     //  If logged not in
//     if(req.session.passport==null){
//         // if don't have cart yet
//         if(req.session.cart==null){
//             console.log('create new cart');
//             cart = await new CartModel()
//             req.session.cart = cart._id
//         }
//         // if have a cart already
//         else{
//             console.log('looking 4 cart of not user');
//             cart = await CartModel.findById(req.session.cart)
//         }
//     }
//
//     else if(req.user!=null){
//         console.log('looking 4 cart of a user');
//         cart = await CartModel.findOne({owner:req.session.passport.user.id})
//         if(cart==null){
//             console.log('creating new cart for user')
//             cart = await new CartModel()
//             cart.owner = req.session.passport.user.id
//             console.log('created the cart')
//         }
//     }
//     else{
//         res.status(500)
//         res.json({'msg':"Veuillez reesayer."})
//     }
//     cart.removeProduct(req.body.productId,req.body.quantity)
//     cart.save((err)=>{
//             if(err) {
//                 res.status(500)
//                 res.json({'msg':"Le produits n'a pas pus etre rajoute. Veuillez reesayer."})
//                 return console.log(err)
//             }
//             res.status(200)
//             return res.json({'msg':"Le produit a ete ajoute avec succes"})
//         })
//
// })
//







module.exports = router;
