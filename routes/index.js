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


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '1412KaitoX@gmail.com',
    pass: 'justkeepg0ing!'
  }
});


/* GET home page. */
router.get('/',async(req,res,next)=>{
    let connected = false;
    console.log('req.cookies: ',req.cookies);
    console.log('req.session: ',req.session);
    if(req.user){
        console.log('cart from req.user: ',req.user.cart);
    }
    let category = await CategoryModel.findByName('Alimentaire')
    try{

        if(req.session.returnTo!=null){
            let route = req.session.returnTo
            console.log(req.session.returnTo)
            req.session.returnTo = null
            console.log(route);
            res.redirect(route)
        }

        else if(req.user){
            return res.render('client/index',{
                message:req.flash(),
                category:category[0],
                connected:true,
                cart:req.user.cart
            })
        }
    }finally{
        if(req.user==null&&req.session!=null)
            return res.render('client/index',
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
    let userId = (req.user!=null)?req.user._id:null
    return res.render('client/cart',{message:req.flash(),cart:cart,user:userId})

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
            if(err) {
                console.log('an error has occured while saving cart')
                console.log(err);
                return next(err)
            }
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

router.get('/getCart',async(req,res,next)=>{
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
    return res.render('client/signin',{cart:req.session.cart,message:req.flash()})
})
router.get('/signup', (req,res,next)=>{
    if(req.user==null)
        res.render('client/signup',{message:req.flash(),cart:req.session.cart})
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
                                name:req.body.name
                        })
    let address = new AddressModel({name:req.body.Nomdulieu,
                                    city:req.body.ville,
                                    block:req.body.address,
                                    user:user._id,
                                    active:true})
    await user.save((err)=>{
        if(err) {
            console.log(err);
            next(err)
        }
    })
    await address.save((err)=>{
        if(err) {
            console.log(err);
            next(err)
        }
    })
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
router.post('/signin',
    passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true  }),
    async (req,res,next)=>{
        console.log('req.query: ',req.query)
        req.flash('info',`Bonjour, ${req.user.name}`)
        // if(err) return next(err)
        // if(info!=null)
        //     req.flash('info',info.message)
        //
        // // if(!user) return res.redirect('/signin')
        // // else{
        // // req.login(user,async (err)=>{



        // if no cart yet
        //console.log('req.user: ' ,req.user);
        req.flash('info',`Bonjour, ${req.user.name}`)

        if(req.session.cart == null){
            if(req.query['api']){
                res.status(200)
                return res.json('Success')
            }
            return res.redirect('/')
        }
        // if had cart before login
        else{
            let cart = await CartModel.findOne({owner:req.user._id})
            //if user has no cart
            if (cart == null){
                cart = await CartModel.findById(req.session.cart)
                cart.owner = req.user._id
            }
            else if(cart!=null){
                let temp = await CartModel.findById(req.session.cart)
                await cart.fuseWith(temp)
                temp.remove()
            }

            cart.save(err=>{
                if(err) {
                    return next(err)}
                if(req.query['api']){
                    res.status(200)
                    return res.json('Success')
                }
                return res.redirect('/')

            })
        }
        // })
        // // }

    }
// )(req,res,next)
    // if(err) return next(err)
    // if(user==false){
    //     return res.render('/signin',{message:info.message})
    // }
    // return res.redirect('/')
// }
)
router.get('/logout',(req,res,next)=>{
    req.session.passport = null
    req.session.cart = null
    req.session.returnTo = null
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
        return res.render('client/products',{message:req.flash(),
                                    products:results,
                                    search:req.body.search,
                                    cart:cart})

    } catch (e) {
        return next(e)
    }
})
router.get('/orders',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    let orders = await OrderModel.find({owner:req.session.passport.user.id}).sort({_id:-1})
    return res.render('client/orders',{message:req.flash(), orders:orders,cart:req.session.passport.user.cart})
})
router.get('/order/:orderId',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    let order = await OrderModel.findById(req.params.orderId)
    await order.populate({path: 'list.product',model:'Product'}).execPopulate()
    return res.render('client/order',{cart:req.session.passport.cart,order:order,message:req.flash()})
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
            let address = {name:req.body.addrName,
                            block:req.body.addrBlock,
                            city:req.body.addrCity
                        }
            order.address = address
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

                    var mailOptions = {
                      from: 'livraison.domicile241@gmail.com',
                      to: 'pmoubel@gmail.com',
                      subject: 'Une commande viens d\'etre effectue',
                      text: `${order}`
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + info.response);
                      }
                    });

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

router.post('/editInfo',connectEnsureLogin.ensureLoggedIn('/signin'),async function(req,res,next){
    let user = await UserModel.findById(req.session.passport.user.id)
    user.name = req.body.name
    user.email = req.body.email
    user.phoneNumber = req.body.phoneNumber
    user.save(err=>{
        if(err) return next(err)
        res.redirect("/profile")
    })
})
// router.get('/test', function(req,res,next) {
//     console.log(req.body)
//     req.flash('successMessage', 'You are successfully using req-flash');
//     req.flash('errorMessage', 'No errors, you\'re doing fine');
//
//     res.redirect('/testing');
// });
//
// router.post('/test',function(req,res,next){
//     console.log(req.body)
//     req.flash('success','Commande modifiee avec succes')
//     res.status(200)
//     res.json({name:'blah blah'})
// })

router.get('/testing', async function(req,res,next) {
    let cart = await CartModel.findByUser(req.session.passport.user.id)
    console.log(cart)
    res.send(req.flash());
});

router.get('/profile',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    let user = await UserModel.findById(req.session.passport.user.id)
    let address = await AddressModel.find({user:user._id})
    if(user.phoneNumber==''){
        req.flash('info','Veuillez rajouter un numéro de telephone')
    }
    return res.render('client/profile',{user:user,message:req.flash(),cart:req.user.cart,address:address})
})
router.post('/addAddress',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    let defaut = (req.body.default==null)? false:true
    let address = new AddressModel({
            name:req.body.Nomdulieu,
            user:req.session.passport.user.id,
            city:req.body.ville,
            block:req.body.address,
            active:defaut
        })
    address.save(err=>{
        if(err){
            res.status(400)
            res.json('An error occured please try again later')

        }else{
            res.status(200)
            res.json('Saved Succesfully')
        }
    })
})
router.get('/deleteAddress/:addressId',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    AddressModel.deleteOne({_id:req.params.addressId},(err,data)=>{
        if(err) {
            res.status(400)
            res.send('An error occured please try again later')
        }else{
            res.status(200)
            res.json('Deleted Succesfully')
        }
    })
})
router.post('/editAddress',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    let defaut = (req.body.default==null)? false:true
    console.log(req.body.id);
    let address = {
            name:req.body.Nomdulieu,
            city:req.body.ville,
            block:req.body.address,
            active:defaut
        }
    AddressModel.updateOne({_id:req.body.id},address,function(err,data){
        if(err){
            res.status(400)
            res.json('An error occured please try again later')
        }else{
            console.log(data);
            res.status(200)
            res.json('Modifiee avec succes')
        }
    })
})
router.get('/getAddresses',connectEnsureLogin.ensureLoggedIn('/signin'),async(req,res,next)=>{
    try {
        let addresses = await AddressModel.find({user:req.session.passport.user.id});
        console.log(req.session.passport.user.id);
        console.log(addresses);
        if(addresses!=null && addresses.length>0){
            res.status(200)
            return res.send(addresses)
        }
        res.status(204)
        return res.json('not found')

    } catch (e) {
        res.status(500)
        return res.send('An error occured: '+e)
    }

})


// facebook
router.get('/auth/facebook',
  passport.authenticate('facebook',{scope:'email'}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/signin' }),
    async function(req, res,next) {
        console.log('shitttttttttttttttttttttttttttttttttttttttt');
        // Successful authentication, redirect home.
        console.log(req.session.passport);
        // if no cart yet
        if(req.session.cart == null){
            if(req.user.phoneNumber.trim()==''){
                return res.redirect('/profile')
            }
            return res.redirect('/')
        }
        // if had cart before login
        else{
            let cart = await CartModel.findOne({owner:req.session.passport.user.id})
            //if user has no cart
            if (cart == null){
                cart = await CartModel.findById(req.session.cart)
                cart.owner = req.session.passport.user.id
            }
            else if(cart!=null){
                let temp = await CartModel.findById(req.session.cart)
                await cart.fuseWith(temp)
                temp.remove()
            }

            await cart.save(err=>{
                if(err) return next(err)
            })
            if(req.user.phoneNumber.trim()==''){
                return res.redirect('/profile')
            }
            return res.redirect('/')

        }
    })
module.exports = router;
