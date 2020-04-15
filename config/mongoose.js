var mongoose = require('mongoose');

//Requirering all the models

require('../models/user');
require('../models/cart');
require('../models/category')
require('../models/product');

//set up default mongoose connection

var mongoDB = 'mongodb+srv://<username>:<password>@cluster0-y2yv1.mongodb.net/glovo241?retryWrites=true&w=majority';
var local = 'mongodb://localhost:27017/test'
mongoose.connect(local);
console.log('gucci gang');
//get the default connection
var db = mongoose.connection;
//console.log('###############################################################');
//console.log(db);
db.on('error',console.error.bind(console, 'MongoDB connection error'));
