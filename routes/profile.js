var express = require('express');
var mongodb = require('mongodb'); 
var date = require('../lib/date_time')
var router = express.Router();
var Topic = require('../models/admin');
var mongoose = require('mongoose');

// Get admin page /dashboard
router.get('/', ensureAuthenticated, function(req, res){
		

		console.log("Requested Homepage");
		var MongoClient = mongodb.MongoClient;
		var mongoUrl = "mongodb://127.0.0.1:27017/debatable";
		var server_date = date.get_date();
		var ObjectId = mongoose.Types.ObjectId;

	
		MongoClient.connect(mongoUrl,function(err,db){
			if(err){
				console.log("Unable to connect to MongoDB " , err)
			}else{
				console.log("Connection establish with MongoDB")
			
				var users = db.collection("users");

				users.find({ '_id': ObjectId(req.user.id)}).toArray(function(err,result){  
					if (err){
						console.log("Error retrieving database collection");
					}else if (result){ 
						if(req.isAuthenticated()){
							res.render("profile",{'user_data':result,'admin':req.user.admin}); //the response data can be changed
							
						}else{
							res.redirect('/users/login'); //the response data can be changed
							
						}

					}else{
						console.log("No data found in collection");
						res.render("profile",{'user_data':result,'admin':req.user.admin}); //the response data can be changed
					}

					db.close();
				});

				
			}


		})
	 
 




});

 


 
 

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){//They are logged in 
		//check if admin
		 
			return next();
		 
		
	} else {

	 	req.flash('error_msg','Please login');
		res.redirect('/users/login');
		
	}
}

module.exports = router;