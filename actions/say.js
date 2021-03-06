var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = "say";
action.description = "I will send a message to socket-connected users in the specified room";
action.inputs = {
	"required" : ["room", "message"],
	"optional" : []
};
action.outputExample = {
	roomStatus: {
		roomStatus: {
			members: [
				{ id:"MTI3LjAuMC4xNjQzNDAwLjUyNDU1NTk1MTgyMjU0OTE="},
				{ id:"MTI3LjAuMDAwLjasdasgagUyNDU1NTk1MTgyMjU0OTE="}
			],
			membersCount: 2
		}
	}
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function(api, connection, next){
	var room = connection.params.room;
	var message = connection.params.message;
		
	// extra stuff the socket users have that http users don't
	connection.id = new Buffer(Math.random() + connection.remoteIP + Math.random()).toString('base64');
	connection.room = room;
	connection.messageCount = 0;
	connection.public = {id: connection.id };
		
	// say it!
	api.chatRoom.socketRoomBroadcast(api, connection, message);
	api.chatRoom.socketRoomStatus(api, room, function(status){
		connection.response.roomStatus = status;
		next(connection, true);
	});
};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
