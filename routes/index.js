var express = require('express');
var mongodb = require('mongodb'); 
var date = require('../lib/date_time');
var router = express.Router();
var db_query = require('../models/db_queries');

// Get Homepage
router.get('/',function(req, res){
	
		console.log("Requested Homepage")
		var MongoClient = mongodb.MongoClient;
		var mongoUrl = "mongodb://127.0.0.1:27017/debatable";
		var server_date = date.get_date();

		MongoClient.connect(mongoUrl,function(err,db){

			db_query.get_all_debates(req,res,db,server_date)

		});
 



});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}//

module.exports = router;