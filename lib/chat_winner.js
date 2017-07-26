var db_query = require('../models/db_queries');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoUrl = "mongodb://127.0.0.1:27017/debatable";
var date = require('./date_time.js');


module.exports.set_win = function(user) {

   console.log("user: " , user , "user id: " , user._id)

//Movethese connects to just the db request files - so the connection is only made once 
		MongoClient.connect(mongoUrl,function(err,db){
			var field = "last_win";
			var field_value = date.get_date();
			db_query.set_user_record(field, field_value,db,user._id,"upd");
		});

		MongoClient.connect(mongoUrl,function(err,db){
			var field = "win_count";
			var field_value = 1;
			db_query.set_user_record(field, field_value,db,user._id,"inc");
		});



}
