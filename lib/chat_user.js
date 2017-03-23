 
	module.exports.new_user = function new_user (user,socketId) {
		this.user = user;
		this.socketId = socketId;
		this.debate_room_id = null; //Name of room the user is in
		this.debate_side = null; //The side of the debate the user is on 	
		this.debate_name = null; // The name of the debate 
		this.in_chat = false;

		this.set_debate_queue = function(debate_name, debate_side){
			this.debate_name = debate_name;
			this.debate_side = debate_side;
		}

		//true,debate_room_id,debate_name,debate_side);
		this.set_debate = function(in_chat,debate_room_id,debate_name,debate_side){
			console.log("Debate set");
			this.in_chat = in_chat;
			this.debate_room_id = debate_room_id;
			this.debate_name = debate_name;
			this.debate_side = debate_side;
		}

	} 
 

