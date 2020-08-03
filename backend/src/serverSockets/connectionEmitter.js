// This class handles all the game connections socket Emitters
class connectionEmitter{
	constructor(server){
		this.server = server;
	}

	broadcast_updateRoomPlayers(data){
		var sendData = {"playersList":data.playersList};
		this.server.to(data.gameid).emit("updateRoomPlayers",sendData);
	}

	broadcast_chatUpdate(data){
		var sendData = {
			from: data.from,
			content: data.content,
			type: data.type
		};
		this.server.to(data.gameid).emit("updateChat",sendData);
	}

	broadcast_gameUpdate(data){        
		this.server.to(data.gameid).emit("updateGame",data);
    }

    broadcast_userUpdate(data){
        console.log("Sending to User: " + String(data.pid));
        this.server.to(data.pid).emit("updateUser",data);
    }
}

export default connectionEmitter;