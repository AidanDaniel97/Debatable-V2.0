var express = require('express');
var mongodb = require('mongodb'); 
var date = require('../lib/date_time')
var router = express.Router();
var Topic = require('../models/admin');

// Get admin page /admin
router.get('/', ensureAuthenticated, function(req, res){
		

		var server_date = date.get_date();


	res.render("admin",{'current_date':server_date,"username":req.user.username,"admin":req.user.admin});
 




});


router.post('/add_topic', function(req, res) { 
 
 	var topic_name = req.body.topic_name;
	var topic_name_short = req.body.topic_name_short;
	var topic_desc = req.body.topic_desc;
	var topic_image = req.body.topic_image;
	var side_one = req.body.side_one;
	var side_two = req.body.side_two;


	// Validation
	req.checkBody('topic_name', 'The topic name is required').notEmpty();
	req.checkBody('topic_name_short', 'The short topic name is required').notEmpty();
	req.checkBody('topic_desc', 'The topic description is required').notEmpty();
	req.checkBody('topic_image', 'The topic image is required').notEmpty();
	req.checkBody('side_one', 'The topic label is required').notEmpty(); 
	req.checkBody('side_two', 'The topic label is required').notEmpty(); 

	var errors = req.validationErrors();

	if(errors){
		res.render('admin',{
			errors:errors
		});

	} else {
		var newTopic = new Topic({
			topic_name:topic_name,
			topic_name_short:topic_name_short,
			topic_desc:topic_desc,
			topic_image:topic_image,
			side_one:side_one,
			side_two:side_two
		});

		Topic.createNewTopic(newTopic, function(err, topic){
			if(err) throw err;
			console.log(topic);
		});
 
		//Redirect with confirmation message
	    req.flash('success_msg', 'Topic has been added.');
	    res.redirect('/admin');
	} 

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