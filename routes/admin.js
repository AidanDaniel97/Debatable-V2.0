var express = require('express');
var mongodb = require('mongodb'); 
var date = require('./controllers/date_time')
var router = express.Router();

// Get admin page /admin
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
					res.render("admin",{'current_date':server_date,"username":req.user.username,"admin":req.user.admin});
				}else{
					console.log("No data found in collection");
					res.render("admin",{'current_date':server_date,"username":req.user.username,"admin":req.user.admin});
				}

				db.close();
			});

			
		}


	})
 




});

function ensureAdmin(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){//They are logged in 
		//check if admin
		if(req.user.admin == true){
			return next();
		}else{
			req.flash('error_msg','Admin area only.');
			res.redirect('/');
		}
		
	} else {

	 	req.flash('error_msg','Please login');
		res.redirect('/users/login');
		
	}
}

module.exports = router;