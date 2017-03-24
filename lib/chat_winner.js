var db_query = require('../models/db_queries');
var mongodb = require('mongodb'); 
var MongoClient = mongodb.MongoClient;
var mongoUrl = "mongodb://127.0.0.1:27017/debatable"; 


module.exports.set_win = function(user) {
    
   console.log("user: " , user , "user id: " , user._id)





		MongoClient.connect(mongoUrl,function(err,db){

			db_query.set_user_record(db,user._id);

		});



   



}