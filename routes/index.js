var express = require('express');
var connectEnsureLogin = require('connect-ensure-login');
var router = express.Router();
var product_controller = require('../controllers/productController')
var category_controller = require('../controllers/categoryController')
var CategoryModel = require('mongoose').model('Category');
var CartModel = require('mongoose').model('Cart');
var ProductModel = require('mongoose').model('Product');
var UserModel = require('mongoose').model('User');
var passport = require('../config/passport')


/* GET home page. */
router.get('/',async(req,res,next)=>{
    let connected = false;
    try{
        if(req.session.passport.user){
            connected = true
        }
    }finally{
        let category = await CategoryModel.findByName('Alimentaire')
        console.log(req.session)
        return res.render('index',{category:category[0],connected:connected})
    }

});
router.get('/cart',  connectEnsureLogin.ensureLoggedIn('/signin'),async (req,res,next)=>{
    let cart = await CartModel.findOne({owner:req.session.passport.user})
    console.log('----------------------- cart:',cart)
    await cart.populate({path: 'list.product',model:'Product'}).execPopulate()
    // console.log('----------------------- cart:',cart)
    return res.render('cart',{cart:cart})

})
//
// CartModel.findOne({owner:req.session.passport.user},(err,cart)=>{
//     if(err) return next(err)
//     cart.populate({path: 'products.id',model:'Product'},(err,cart)=>{
//         if(err) return next(err)
//         console.log('cart:',cart.products)
//         return res.render('cart',{cart:cart})
//     })
//     // cart.populate({path:'products',model:'Product'},(err,cart)=>{
//         // console.log('cart:',cart)
//         // res.render('cart',{cart:cart})
//     // })
// })
router.post('/addToCart',async (req,res,next)=>{
    if(!req.session.passport){
        return res.redirect('/signin')
    }
    else{
        let cart = await CartModel.findOne({owner:req.session.passport.user})
        // console.log(cart)
        cart.addProduct(req.body.productId,req.body.quantity)
        cart.save((err)=>{
            if(err) return next(err)
            return res.redirect('/product/'+req.body.productId)
        })
    }

})

router.get('/signin', (req,res,next)=>{
    if(req.session.passport){
        if(req.session.passport.user)
            return res.redirect('/')
    }
    return res.render('signin')
})

router.get('/signup', (req,res,next)=>{
    res.render('signup')
})
router.post('/signup',async (req,res,next)=>{
    if(await UserModel.exists(req.body.email)){
        return res.render('signup',
            {message:"Cette adresse email est deja utiliser pour un autre compte"})
    }
    let user = new UserModel({email:req.body.email,
                                password:req.body.password})
    await user.save()
    console.log(user)
    req.login(user,(err)=>{
        if(err) return next(err)
        return res.redirect('/')
    })
})
router.post('/signin', passport.authenticate('local',{successReturnToOrRedirect:'/',
                                                        failureRedirect:'/signin'}))
router.post('/search',async (req,res,next)=>{
    try {
        let results = await ProductModel.find({name:{$regex:`${req.body.search}`, $options:"i"}})
        console.log(results)
        return res.render('products',{products:results, search:req.body.search})
    } catch (e) {
        return next(e)
    }
})

var authorised


module.exports = router;
