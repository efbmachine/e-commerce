var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoryController')
var CategoryModel = require('mongoose').model('Category');


/* GET home page. */

router.get('/', async (req,res,next)=>{
    try{
        let result = await CategoryModel.getCategories() 
        console.log('? index of category page:', result)
        if(result!= null)
            return res.json( result )
        else {
            res.status=500
            new Error('Something went wrong when fetching categories')
        }
       
    }catch(e){
        return  next(e)
    }
})

router.get('/:categoryName/:subcategoryId',async (req,res,next)=>{
    try {
        let cat = await CategoryModel.findByName(req.params.categoryName)
        let subcat = await cat[0].getSubCategory(req.params.subcategoryId)
        let cart = (req.user==null)? req.session.cart:req.session.passport.user.cart
        console.log('cart:   ' ,cart);
        return res.render('client/subcategory',{message:req.flash(),subCat:subcat,cart:cart})

    } catch (e) {
        return res.status(404).render('error',{message:"Could not find category or subcategory",error:e})
    }
})


// router.post('/edit/:category',category_controller.edit)

// router.get('/',product_controller.getCategories)
// router.get('/subCat/:subCat', product_controller.getBySubCategory)
// router.get('/:category',product_controller.getByCategory)

module.exports = router;
