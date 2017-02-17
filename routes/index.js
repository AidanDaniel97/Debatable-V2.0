var express = require('express');
var mongodb = require('mongodb'); 
var date = require('./controllers/date_time')
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	

		console.log("Requested Homepage")
		var MongoClient = mongodb.MongoClient;
		var mongoUrl = "mongodb://127.0.0.1:27017/debatable";
		var server_date = date.get_date();


	MongoClient.connect(mongoUrl,function(err,db){
		if(err){
			console.log("Unable to connect to MongoDB " , err)
		}else{
			console.log("Connection establish with MongoDB")
		
			var topics = db.collection("topics");

			topics.find().toArray(function(err,result){ 
				if (err){
					console.log("Error retrieving database collection");
				}else if (result){ 
					res.render("index",{'topic_list':result,'current_date':server_date,"username":req.user.name,"admin":req.user.admin}); //the response data can be changed
				}else{
					console.log("No data found in collection");
					res.render("index",{'topic_list':result,'current_date':server_date,"username":req.user.name,"admin":req.user.admin}); //the response data can be changed
				}

				db.close();
			});

			
		}


	})
 




});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;