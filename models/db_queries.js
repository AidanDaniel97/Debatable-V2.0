//Queries for mongo DB debate topics
var async = require('async');

function get_top_debates(db,callback) {
  db.collection('top_topics', function(err, collection) {
    collection.find().toArray(callback);
    //db.close();
  });
}

function get_user_debates(db,callback) {
  db.collection('user_topics', function(err, collection) {
    collection.find().toArray(callback);
    //db.close();
  });
}

exports.get_all_debates = function(req, res,db,server_date) { 
  async.parallel({
    top_debates: async.apply(get_top_debates, db),
    user_debates: async.apply(get_user_debates, db)
  }, function (error, results) {
    if (error) {
    	console.log("err")
      res.status(500).send(error);
      return;
    }
     
    res.render("index",{'top_debates_list':results.top_debates,'user_debates_list':results.user_debates,'current_date':server_date,"user":req.user}); //the response data can be changed
					
  });
};