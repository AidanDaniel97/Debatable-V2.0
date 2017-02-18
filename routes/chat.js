var express = require('express');
var mongodb = require('mongodb'); 
var date = require('./controllers/date_time')
var router = express.Router();


// Get admin page /chat
router.get("/:debate_name/join", ensureAuthenticated, function(req,res){
	//get debate information from databse here 
	var MongoClient = mongodb.MongoClient;
	var mongoUrl = "mongodb://127.0.0.1:27017/debatable";

	MongoClient.connect(mongoUrl,function(err,db){
		if(err){
			console.log("Unable to connect to MongoDB " , err)
		}else{
			console.log("Connection establish with MongoDB")
		
			var topics = db.collection("topics"); 
			topics.find({"topic_name_short" : decodeURI(req.params.debate_name)}).toArray(function(err,result){ 
				if (err){
					console.log("Error retrieving database collection"); 
				}else if (result){ 
					res.render("chat", {'debate_mode':'join', 'debate_db_info':result, title: 'my other page', layout: 'chat_layout'}) //Load the view chat  
				}else{
					console.log("No data found in collection"); 
					res.render("chat", {'debate_mode':'join', 'debate_db_info':result, title: 'my other page', layout: 'chat_layout'}) //Load the view chat 
				}

				db.close();
			});

			
		}


	})


});




// Get admin page /chat
router.get("/:debate_name/spectate", function(req,res){
	//get debate information from databse here 
	var MongoClient = mongodb.MongoClient;
	var mongoUrl = "mongodb://127.0.0.1:27017/debatable";

	MongoClient.connect(mongoUrl,function(err,db){
		if(err){
			console.log("Unable to connect to MongoDB " , err)
		}else{
			console.log("Connection establish with MongoDB")
		
			var topics = db.collection("topics"); 
			topics.find({"topic_name_short" : decodeURI(req.params.debate_name)}).toArray(function(err,result){ 
				if (err){
					console.log("Error retrieving database collection"); 
				}else if (result){ 
					res.render("chat", {'debate_mode':'spectate', 'debate_db_info':result, title: 'my other page', layout: 'chat_layout'}) //Load the view chat  
				}else{
					console.log("No data found in collection"); 
					res.render("chat", {'debate_mode':'spectate', 'debate_db_info':result, title: 'my other page', layout: 'chat_layout'}) //Load the view chat 
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
		res.redirect('/');
	}
}

module.exports = router;