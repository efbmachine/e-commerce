var mongoose = require('mongoose');

//Requirering all the models
require('../models/address');
require('../models/order')
require('../models/user');
require('../models/cart');
require('../models/category');
require('../models/tag');
require('../models/product');
require('../models/admin');



//set up default mongoose connection
var realMDB = 'mongodb+srv://webApp:NJtXnDLb46XKeak@cluster0-fizxw.mongodb.net/glovo241?retryWrites=true&w=majority'
var local = 'mongodb://localhost:27017/test'
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser',true)
mongoose.connect(realMDB);
//get the default connection
var db = mongoose.connection;
//console.log('###############################################################');
//console.log(db);
db.on('error',console.error.bind(console, 'MongoDB connection error'));
