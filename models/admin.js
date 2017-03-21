var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var TopicSchema = mongoose.Schema({
	topic_name: {
		type: String,
		index:true
	},
	topic_name_short: {
		type: String
	},
	topic_desc: {
		type: String
	},
	topic_image: {
		type: String
	},
	side_one: {
		type: String
	},
	side_two: {
		type: String
	}
});

 
			 


var Topic = module.exports = mongoose.model('top_topics', TopicSchema);

module.exports.createNewTopic = function(newTopic, callback){
	        newTopic.save(callback);
}

 