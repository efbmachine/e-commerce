var express = require('express');
var connectEnsureLogin = require('connect-ensure-login');
var router = express.Router();
var product_controller = require('../controllers/productController')
var category_controller = require('../controllers/categoryController')
var CategoryModel = require('mongoose').model('Category');
var OrderModel = require('mongoose').model('Order');
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

router.post('/saveCart',async(req,res,next)=>{
    if(!req.session.passport){
        return res.redirect('/signin')
    }else{
        let cart = await CartModel.findOne({owner:req.session.passport.user})
        cart.editCart(req.body.item,req.body.qty)
        cart.save(err=>{
            if(err) return next(err)
            let message = "Changements enregistres"
            return res.redirect('/cart')
        })
    }
})
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
router.get('/logout',(req,res,next)=>{
    req.session.passport = null
    res.redirect('/')
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
router.get('/orders',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    let orders = await OrderModel.find({owner:req.session.passport.user})
    return res.render('orders',{orders:orders})
})
router.get('/order/:orderId',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    let order = await OrderModel.findById(req.params.orderId)
    await order.populate({path: 'list.product',model:'Product'}).execPopulate()
    return res.render('order',{order:order})
})
router.post('/order',async(req,res,next)=>{
    if(!req.session.passport.user){
        return res.redirect('/signin')
    }else{
        console.log('------------------------------------- req.body',req.body)
        let order = new OrderModel()
        order.owner= req.session.passport.user
        order.price = req.body.price
        let item
        try {
            req.body.item.forEach((element, i) => {
                item = {}
                item.product = req.body.item[i]
                item.quantity = req.body.qty[i]
                order.list.push(item)
            })
        } catch (e) {
            item = {}
            item.product = req.body.item
            item.quantity = req.body.qty
            order.list.push(item)
        } finally {
            order.save(err=>{
                if(err) return next(err)
                return res.redirect(`/order/${order._id}`)
            })
        }


    }
})

router.get('/profile',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    let user = await UserModel.findById(req.session.passport.user)
    return res.render('profile',{user:user})
})

var authorised


module.exports = router;
