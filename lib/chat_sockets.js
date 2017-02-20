// sockets.js
var socketio = require('socket.io')
var queue_manager = require('./queue_manager.js');

module.exports.listen = function (app) {
    var io = socketio.listen(app)

    //Socket.io connection
    io.on('connection', function (socket) {
        console.log('a user connected ' + socket.id);
        //Add to socket list
        socket_list[socket.id] = socket;

        socket.on("join_debate", function (debate_info) {
            var debate_name = debate_info.debate_name;
            var debate_side = debate_info.debate_side;
            console.log("User wanting to join debate: ", debate_name);
            //Make this a queue script:  
            //User reachers top of queue!!!=========
            //create_room(socket, debate_name);//Create a room and send them to it
            //join_debate(socket,debate_name);
            //Join debate queue

            queue_manager.join_debate_queue(socket, debate_name, debate_side);

        });


        socket.on("spectate_debate", function (debate_name) {
            console.log("User wanting to spectate debate: ", debate_name);
            //Make this a queue script:  
        });




        socket.on('chat message', function (msg) {
            io.in(msg.room_id).emit('new message', msg.message);


        });

        socket.on('disconnect', function () {
            //remove the user from the debate queue
            chat_user = socket_list[socket.id]

        });


    });



    socket_list = {};
    queues_holder = [];



    function spectate_debate(socket, debate_name) {
        console.log("Spectating the debate " + debate_name);

    }




    return io
}