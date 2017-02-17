var express = require('express');
var mongodb = require('mongodb'); 
var date = require('./controllers/date_time')
var router = express.Router();

// Get admin page /chat
router.get("/:debate_name/:debate_mode", function(req,res){
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
					res.render("chat", {'debate_mode':req.params.debate_mode, 'debate_db_info':result}) //Load the view chat  
				}else{
					console.log("No data found in collection"); 
					res.render("chat", {'debate_mode':req.params.debate_mode, 'debate_db_info':result}) //Load the view chat 
				}

				db.close();
			});

			
		}


	})


});
 
module.exports = router;