var mongoose = require('mongoose');

//Requirering all the models
require('../models/order')
require('../models/cart');
require('../models/user');
require('../models/category');
require('../models/product');

//set up default mongoose connection
var realMDB = 'mongodb+srv://webApp:NJtXnDLb46XKeak@cluster0-fizxw.mongodb.net/glovo241?retryWrites=true&w=majority'
var local = 'mongodb://localhost:27017/test'
mongoose.connect(realMDB, {useUnifiedTopology:true, useNewUrlParser:true});
console.log('gucci gang');
//get the default connection
var db = mongoose.connection;
//console.log('###############################################################');
//console.log(db);
db.on('error',console.error.bind(console, 'MongoDB connection error'));
