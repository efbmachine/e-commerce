var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoryController')
var CategoryModel = require('mongoose').model('Category');


/* GET home page. */

router.get('/:categoryName/:subcategoryId',async (req,res,next)=>{
    try {
        let cat = await CategoryModel.findByName(req.params.categoryName)
        let subcat = await cat[0].getSubCategory(req.params.subcategoryId)
        return res.render('subcategory',{message:req.flash(),subCat:subcat})

    } catch (e) {
        return res.status(404).render('error',{message:"Could not find category or subcategory",error:e})
    }
})


// router.post('/edit/:category',category_controller.edit)

// router.get('/',product_controller.getCategories)
// router.get('/subCat/:subCat', product_controller.getBySubCategory)
// router.get('/:category',product_controller.getByCategory)

module.exports = router;
