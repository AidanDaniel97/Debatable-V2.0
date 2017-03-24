var chat_winner = require("./chat_winner.js");

exports.randomString = function randomString(length) {

    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}



exports.join_debate = function join_debate(socket,debate_name){    
    console.log("Joined the debate " + debate_name);
    if (queues_holder[debate_name] == undefined){
    	queues_holder[debate_name] = [];
    } 
    queues_holder[debate_name][socket.id] = socket.id;
    console.log("===== " , queues_holder)
}



exports.join_debate_queue = function join_debate_queue(socket,debate_name,debate_side,chat_user){ 
	//queues_holder["trump"] = ["123","666","987"]; 
	if (!queues_holder[debate_name]){
		queues_holder[debate_name] = [];
	}

	if (!queues_holder[debate_name][debate_side]){
		queues_holder[debate_name][debate_side] = [];
	}
	//queues_holder.trump.push("hello")
	queues_holder[debate_name][debate_side].push(socket.id) //add socket id to list


	//set debate queue on user class
	chat_user.set_debate_queue(debate_name,debate_side)
	console.log("User has joined debate queue ====== " + queues_holder[debate_name][debate_side].length);

	exports.check_debate_queue(debate_name,debate_side);
};


exports.check_debate_queue = function check_debate_queue(debate_name, debate_side){

	if (debate_side == "side_one"){
		if(queues_holder[debate_name]["side_two"] && queues_holder[debate_name]["side_two"].length  >= 1){
			exports.create_debate_room(debate_name);
		}else{
			console.log("Not enough people in the " + debate_name + " disagree queue to start a debate.")
		}
	}else{
		if(queues_holder[debate_name]["side_one"] && queues_holder[debate_name]["side_one"].length >= 1){
			exports.create_debate_room(debate_name);
		}else{
			console.log("Not enough people in the " + debate_name + " agree queue to start a debate.")
		}
	}

};



exports.chat_user_disconnect = function chat_user_disconnect(socketId,io){
  	chat_user = chat_users_list[socketId];
	user_in_chat = chat_users_list[socketId].in_chat;
	user_debate_side = chat_users_list[socketId].debate_side;
	user_debate_name = chat_users_list[socketId].debate_name;


	//user was in a chat
	if(user_in_chat){
		console.log("Chat user has dsiconnected from an active chat ");  
		if (io.sockets.adapter.rooms[room_id]){
			//get the details of the chatter who did not disconnect
			user_socket_id = Object.keys(io.sockets.adapter.rooms[room_id].sockets)[0];
	        //Emit message to client
	        io.sockets.connected[user_socket_id].emit("chat_won","Well Done!");
	        //set the data in the database on the user's profile, pass authenticated user to chat_winner
	        chat_winner.set_win(socket_list[user_socket_id].request.user); 
	    }           	 

	//User was not in a chat, check if they have a "side" set meaning they are in a queue
	}else if (chat_users_list[socketId].debate_side){
		console.log("User disconnected from a queue");
 		queues_holder[user_debate_name][user_debate_side] = queues_holder[user_debate_name][user_debate_side].splice(1);//remove the user from queue

 		//Set user values back to null
		user_debate_name = null;
		user_debate_side = null;
	}else{
		console.log("User disconnected from the main screen");
	}

	//Remove the user completely from user list
	delete chat_users_list[socketId]; 

	 
}
 
exports.create_debate_room = function create_debate_room(debate_name){
	room_id = exports.randomString(16);
	console.log("New room created", room_id);
	//debate_queue.trump.agree[0]
	for (i = 0; i <= 1; i++) {//get sockets of first 2 people in queue  
    	if (i == 0){
    		current_socket_id = queues_holder[debate_name]["side_one"][0];
    		debate_side = "side_one";
    	}else{
    		current_socket_id = queues_holder[debate_name]["side_two"][0];
    		debate_side = "side_two";
    	}
    	current_socket = socket_list[current_socket_id]; 
    	current_socket.join(room_id);
    	console.log("User joined a new room")
    	room_data = {'debate_name':debate_name,'room_id':room_id};
    	current_socket.emit("joined_room",room_data);
    	//Set user to "in chat"
    	chat_users_list[current_socket_id].set_debate(true,room_id,debate_name,debate_side);
   	}
	//Remove these users from the queue
 	console.log("before: " + queues_holder[debate_name]["side_one"]);
 	queues_holder[debate_name]["side_one"] = queues_holder[debate_name]["side_one"].splice(1);//remove the first user 
 	queues_holder[debate_name]["side_two"] = queues_holder[debate_name]["side_two"].splice(1);//remove the first user

 	console.log("After: " + queues_holder[debate_name]["side_one"])

}


 