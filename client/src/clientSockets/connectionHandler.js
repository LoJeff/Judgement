// This class handles all the game connections socket handlers
class connectionHandler{
	constructor(client,react){
		this.client = client;
		this.react = react;
		this.chatReact = null;
	}

	updateReact(newReact){
		this.react = newReact;
    }
    
    updateChatReact(newChatReact){
		this.chatReact = newChatReact;
	}

	// Notifies the client that a new member has joined the game room
	updateRoomPlayers(data){
		// data
			// data.players
		this.react.setState({"playersList": data.playersList});
	}

	updateGame(data){
        console.log(String(data));
    }
    
    updateUser(data){
        console.log("Received Data for User " + String(data.userid));
    }

	eventHandlers(){
		const client = this.client;
		client.on("updateRoomPlayers",function(data){
			this.updateRoomPlayers(data);
		}.bind(this));

		client.on("updateGame",function(data){
			this.updateGame(data);
        }.bind(this));
        
        client.on("updateUser",function(data){
			this.updateUser(data);
        }.bind(this));
	}

}

export default connectionHandler;