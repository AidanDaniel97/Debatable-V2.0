var express = require('express');
var mongodb = require('mongodb');
var date = require('../lib/date_time');
var router = express.Router();
var db_query = require('../models/db_queries');

// Get API page /api
router.get("/bookmark_debate", ensureAuthenticated, function(req, res) {
	console.log("user want's to add debate to profile ", req.query.debateId)
	//Started o this
	var field = "debate_bookmarks";
	db_query.set_user_record(field, req.query.debateId, req.user._id,"push");
	//field,field_value,userId,command
	res.send('test string');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//res.flash('error_msg','You are not logged in');
		//res.redirect('/users/login');
		res.send({"error":"Sorry, you need to be logged in to use that feature."});
	}
}//

module.exports = router;
