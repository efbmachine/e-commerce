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
    console.log('req.session',req.session);
    let category = await CategoryModel.findByName('Alimentaire')
    try{
        if(req.session.passport.user.id){
            return res.render('index',{
                message:req.flash(),
                category:category[0],
                connected:true,
                cart:req.user.cart
            })
        }
    }finally{
        if(req.user==null&&req.session!=null)
            return res.render('index',
                {message:req.flash(),
                    category:category[0],
                    cart:req.session.cart})
    }

});

router.get('/cart',async (req,res,next)=>{
    let cart
    //  If logged not in
    if(req.user==null){
        // if don't have cart yet
        if(req.session.cart==null){
            cart = await new CartModel()
            req.session.cart = cart._id
            await cart.save()
            console.log('saved new cart FROM /CART')
        }
        // if have a cart already
        else{
            console.log('rreq.session ',req.session);
            cart = await CartModel.findById(req.session.cart)
        }
    }
    // If logged in
    else{
        cart = await CartModel.findOne({owner:req.session.passport.user.id})
        if(cart==null){
            cart = await new CartModel()
            cart.owner = req.session.passport.user.id
            await cart.save(err=>{
                if(err) return next(err)
            })
        }
        console.log('get cart 4 user')
    }
    console.log(cart)
    await cart.populate({path: 'list.product',model:'Product'}).execPopulate()
    // console.log('----------------------- cart:',cart)
    return res.render('cart',{message:req.flash(),cart:cart})

})
router.post('/saveCart',async(req,res,next)=>{
    let cart
    if (req.session.passport!=null) {
        cart = await CartModel.findOne({owner:req.session.passport.user.id})
    }
    else{
        cart = await CartModel.findById(req.session.cart)
    }
    cart.editCart(req.body.item,req.body.qty)
    cart.save(err=>{
        if(err) return next(err)
        req.flash('success',"Changements enregistres")
        return res.redirect('/cart')
    })
})
router.post('/addToCart',async (req,res,next)=>{
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

    else{
        console.log('looking 4 cart of a user');
        cart = await CartModel.findOne({owner:req.session.passport.user.id})
        if(cart==null){
            console.log('creating new cart for user')
            cart = await new CartModel()
            cart.owner = req.session.passport.user.id
            console.log('created the cart')
        }
    }
    cart.addProduct(req.body.productId,req.body.quantity)
    cart.save((err)=>{
            if(err) return next(err)
            console.log('save with success')
            req.flash('success','Product ajoute avec succes')
            return res.redirect('/product/'+req.body.productId)
        })


})
router.post('/emptyCart',async (req,res,next)=>{
    let cart
    //  If logged not in
    if(req.session.passport==null){
        // if don't have cart yet
        if(req.session.cart==null){

        }
        // if have a cart already
        else{
            console.log('looking 4 cart of not user');
            cart = await CartModel.findById(req.session.cart)
        }
    }

    else{
        console.log('looking 4 cart of a user');
        cart = await CartModel.findOne({owner:req.session.passport.user.id})
        console.log('cart-----------',cart)
        if(cart==null){
            console.log('creating new cart for user')
            cart = await new CartModel()
            console.log('created the cart')
        }
    }
    console.log(cart)
    cart.empty()
    cart.save((err)=>{
            if(err) return next(err)
            req.flash('success','Panier vider avec succes')
            return res.redirect('/cart')
        })
})

router.get('/getCart/:cartId',async(req,res,next)=>{
    let cart
    try {
        if(req.session.passport.user!=null){
            console.log('got user cart')
            cart = await CartModel.findByUser(req.session.passport.user.id)
            res.status(200)
            return res.json({number:cart.numOfProducts})
        }

    } catch(e) {

         if(req.session.cart == null && req.session.passport==null){
            console.log('cart empty')
            return res.json({number:0, message:'Cart is empty'})
        }

        else if (req.session.cart!=null){
            console.log('get not logged in cartId')
            cart = await CartModel.findById(req.session.cart)

            console.log('Number of items in a cart: ',cart.numOfProducts)
            return res.json({number:cart.numOfProducts})
        }
    }
    console.log('we dono');

})

router.get('/signin', (req,res,next)=>{
    if(req.session.passport!=null){
        if(req.session.passport.user.id){
            req.flash('info','Vous etes deja connecte')
            return res.redirect('/')
        }
    }
    console.log('This is req.flash():   ',req.flash())
    return res.render('signin',{cart:req.session.cart,message:req.flash()})
})
router.get('/signup', (req,res,next)=>{
    if(req.user==null)
        res.render('signup',{message:req.flash(),cart:req.session.cart})
    else {
        req.flash('info','Vous avez deja un compte et etes connecter')
        res.redirect('/')
    }
})
router.post('/signup',async (req,res,next)=>{
    if(await UserModel.exists(req.body.email)){
        req.flash('info','Cette adresse email est deja utiliser pour un autre compte')
        return res.redirect('/signup')
    }
    let user = new UserModel({email:req.body.email,
                                password:req.body.password,
                                phoneNumber:req.body.number,
                                name:req.body.name,
                                address:req.body.address})
    await user.save()
    console.log(user)
    req.login(user,async (err)=>{
        if(err) return next(err)
        if(req.session.cart != null){
            let cart = await CartModel.findById(req.session.cart)
            if(cart!=null){
                cart.owner = user._id
                cart.save()
            }
        }
        return res.redirect('/')
    })
})
router.post('/signin', async (req,res,next)=>{
    return passport.authenticate('local',(err,user,info)=>{
        if(err) return next(err)
        if(info!=null)
            req.flash('info',info.message)

        if(!user) return res.redirect('/signin')
        if(user){
            req.login(user,async (err)=>{
                // if no cart yet
                if(req.session.cart == null){
                    req.flash('info',`Bonjour, ${user.name}`)
                    return res.redirect('/')
                }
                // if had cart before login
                else{
                    let cart = await CartModel.findOne({owner:user._id})
                    //if user has no cart
                    if (cart == null){
                        cart = await CartModel.findById(req.session.cart)
                        cart.owner = user._id
                    }
                    else if(cart!=null){
                        let temp = await CartModel.findById(req.session.cart)
                        await cart.fuseWith(temp)
                        temp.remove()
                    }

                    cart.save(err=>{
                        if(err) return next(err)
                        return res.redirect('/')

                    })
                }
            })
        }

    })(req,res,next)
    // if(err) return next(err)
    // if(user==false){
    //     return res.render('/signin',{message:info.message})
    // }
    // return res.redirect('/')
})
router.get('/logout',(req,res,next)=>{
    req.session.passport = null
    req.session.cart = null
    res.redirect('/')
})
router.post('/search',async (req,res,next)=>{
    try {
        let results = await ProductModel.find({name:{$regex:`${req.body.search}`, $options:"i"}})
        console.log(results.length)
        if(results.length<5){
            let more = await ProductModel.find({tags:{$regex:`${req.body.search}`,$options:'i'}})
            results = results.concat(more)
        }
        let cart = (req.user==null)? req.session.cart:req.session.passport.user.cart
        return res.render('products',{message:req.flash(),
                                    products:results,
                                    search:req.body.search,
                                    cart:cart})

    } catch (e) {
        return next(e)
    }
})
router.get('/orders',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    let orders = await OrderModel.find({owner:req.session.passport.user.id}).sort({_id:-1})
    return res.render('orders',{message:req.flash(), orders:orders,cart:req.session.passport.user.cart})
})
router.get('/order/:orderId',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    let order = await OrderModel.findById(req.params.orderId)
    await order.populate({path: 'list.product',model:'Product'}).execPopulate()
    return res.render('order',{cart:req.session.passport.cart,order:order,message:req.flash()})
})
router.post('/order',async(req,res,next)=>{
    if(req.session.passport!=null){
        if(req.session.passport.user.id==null){
            req.flash('info','Creez un compte ou connectez vous afin de commander')
            req.session.redirectTo = '/cart'
            return res.redirect('/signin')
        }
        else{
            let cart = await CartModel.findOne({owner:req.session.passport.user.id})
            console.log('--------------------------- usercart: ',cart)
            if(cart!=null){
                cart.empty()
                cart.save()
            }
            console.log('------------------------------------- req.body',req.body)
            let order = new OrderModel()
            order.owner= req.session.passport.user.id
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
    }else{
        req.flash('info','Creez un compte ou connectez vous afin de commander')
        req.session.redirectTo = '/cart'
        return res.redirect('/signin')

    }
})


router.get('/test', function(req,res,next) {
    console.log(req.body)
    req.flash('successMessage', 'You are successfully using req-flash');
    req.flash('errorMessage', 'No errors, you\'re doing fine');

    res.redirect('/testing');
});

router.post('/test',function(req,res,next){
    console.log(req.body)
    req.flash('success','Commande modifiee avec succes')
    res.status(200)
    res.json({name:'blah blah'})
})

router.get('/testing', async function(req,res,next) {
    let cart = await CartModel.findByUser(req.session.passport.user.id)
    console.log(cart)
    res.send(req.flash());
});

router.get('/profile',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    let user = await UserModel.findById(req.session.passport.user.id)
    return res.render('profile',{user:user,message:req.flash(),cart:req.user.cart})
})

var authorised


module.exports = router;
