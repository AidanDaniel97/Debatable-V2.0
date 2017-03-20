 
	module.exports.new_user = function new_user (user,socketId) {
		this.user = user;
		this.socketId = socketId;
		this.debate_room = null; //Name of room the user is in
		this.debate_side = null; //The side of the debate the user is on 	
		this.debate_name = null; // The name of the debate 
		this.in_chat = false;

		this.set_debate_queue = function(debate_name, debate_side){
			this.debate_name = debate_name;
			this.debate_side = debate_side;
		}

		this.set_debate = function(debate_room, debate_side, debate_name){
			console.log("Debate set")
		}

	} 
 

