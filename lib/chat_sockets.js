var queue_manager = require('./queue_manager.js');
var chat_user = require('./chat_user.js');
var socketio = require("socket.io");
var http = require('http');
var socketio = require('socket.io');
var passportSocketIo = require('passport.socketio');
var cookieParser = require('cookie-parser');
var passportSocketIo = require("passport.socketio");


module.exports.listen = function(server, mongostore) {

    var io = socketio.listen(server)


    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser, // the same middleware you registrer in express
        key: 'express.sid', // the name of the cookie where express/connect stores its session_id
        secret: 'secret', // the session_secret to parse the cookie
        store: mongostore, // we NEED to use a sessionstore. no memorystore please
        success: onAuthorizeSuccess, // *optional* callback on success - read more below
        fail: onAuthorizeFail, // *optional* callback on fail/error - read more below
    }));


    function onAuthorizeSuccess(data, accept) {
        console.log('successful connection to socket.io');

        // The accept-callback still allows us to decide whether to
        // accept the connection or not.
        accept(null, true);

    }

    function onAuthorizeFail(data, message, error, accept) {
        if (error)
            throw new Error(message);
        console.log('failed connection to socket.io:', message);

        // We use this callback to log all of our failed connections.
        accept(null, false);

        // OR

        // If you use socket.io@1.X the callback looks different
        // If you don't want to accept the connection
        if (error)
            accept(new Error(message));
        // this error will be sent to the user as a special error-package
        // see: http://socket.io/docs/client-api/#socket > error-object
    }


    //Socket.io connection
    io.on('connection', function(socket) {

        console.log('a user connected ', socket.request.user , "socket id: " , socket.id);
        
        
        //Add to socket list
        socket_list[socket.id] = socket;


        socket.on("join_debate", function(debate_info) { 
            console.log("User wanting to join debate: ", debate_info.debate_name); 
            new_chat_user = new chat_user.new_user(socket.request.user,socket.id);
            //Add user to users holder
            chat_users_list[socket.id] = new_chat_user;
            queue_manager.join_debate_queue(socket, debate_info.debate_name, debate_info.debate_side, new_chat_user);
        });


        socket.on("spectate_debate", function(debate_name) {
            console.log("User wanting to spectate debate: ", debate_name);
            //Make this a queue script:  
        });




        socket.on('chat message', function(message) { //"message" , "room_id"
            msg_data = {'message': message.message , 'username':socket.request.user.username}
            io.in(message.room_id).emit('new message', msg_data);


        });

        socket.on('disconnect', function() {
            //remove from socket list
            delete socket_list[socket.id];
            //Remove user from queue / chat room
            if (chat_users_list[socket.id]){//If the user exists in chat list
                queue_manager.chat_user_disconnect(socket.id);
            }else{
                console.log("User was either spectator or did not join queue")
            }

        });


    });



    socket_list = {};
    chat_users_list = {};
    queues_holder = [];



    function spectate_debate(socket, debate_name) {
        console.log("Spectating the debate " + debate_name);

    }




    return io
}