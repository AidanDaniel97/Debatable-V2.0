//Queries for mongo DB debate topics
var async = require('async');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var MongoClient = mongodb.MongoClient;
var mongoUrl = "mongodb://127.0.0.1:27017/debatable";



function get_debates(callback) {
  MongoClient.connect(mongoUrl,function(err,db){
    db.collection('debates', function(err, collection) {

    collection.find().toArray(callback);
        //db.close();

    });
  });
}

exports.get_bookmarked_debates = function(bookmarked_debates, callback){
    MongoClient.connect(mongoUrl,function(err,db){
      //for (debate in bookmarked_debates){
        //console.log("test " , bookmarked_debates[debate])
        db.collection('debates', function(err, collection) {
          var debatesList = [];
          for (debate in bookmarked_debates){
            db.collection("debates").find({ _id: ObjectId(bookmarked_debates[debate]) }).toArray(function(err,result){
              //debatesList.push(result);
            callback(result);

            });
          }

        });

        db.close();


    });
  }


function get_user_debates(callback) {
  MongoClient.connect(mongoUrl,function(err,db){
    db.collection('user_topics', function(err, collection) {
      collection.find().toArray(callback);
      db.close();
    });
  });
}

exports.get_all_debates = function(req, res,server_date) {
  async.parallel({
    top_debates: async.apply(get_debates),
    user_debates: async.apply(get_user_debates)
  }, function (error, results) {
    if (error) {
    	console.log("err")
      res.status(500).send(error);
      return;
    }

    if(req.user){
      res.render("index",{'top_debates_list':results.top_debates,'user_debates_list':results.user_debates,'current_date':server_date,'admin':req.user.admin}); //the response data can be changed
		}else{
      res.render("index",{'top_debates_list':results.top_debates,'user_debates_list':results.user_debates,'current_date':server_date}); //the response data can be changed
    }
  });
};

exports.set_bookmark = function(value){
  console.log("Value recieved " + value)
}

exports.set_user_record = function(field,field_value,userId,command){
  MongoClient.connect(mongoUrl,function(err,db){
  if (command == "inc"){

    db.collection('users').update(

    {
      "_id": userId
    },

    {
        $inc: {[field]: 1},

    });


  }else if(command == "push"){
    console.log("test")

    db.collection("users").update(
     { "_id": userId },
     { $push: { [field]: field_value } }
  )


}else{
    db.collection('users').update(

    {
      "_id": userId
    },

    {
        $set: {[field]: field_value},

    });
  }

  db.close();

});


}
