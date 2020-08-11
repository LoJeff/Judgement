// This class handles all the connection events that
// are emitted from the client
class connectionEmitter {
	constructor(client){
		this.client = client;
	}

	joinGameRoom(nickname,gameid){
		const client = this.client;
		const data = {"gameid": gameid, "name": nickname};
		client.emit("joinGameRoom",data);
	}

	leaveGameRoom(nickname,gameid){
		const client = this.client;
		const data = {"gameid": gameid, "name": nickname};
		client.emit("leaveGameRoom",data);
	}

	startGame(gameid){
		const client = this.client;
		const data = {"gameid": gameid};
		client.emit("startGame",data);
	}

	dummyFunction() {
		const client = this.client;
		client.emit("dummyFunction");
		console.log("emitted dummyFunction event");
	}

	sendPunishment(punishment){
		const client = this.client;
		const data = {"punishment": punishment};
		client.emit("sendPunishment",data);
	}

	sendTargets(targetA, targetB){
		const client = this.client;
		const data = {"targetA": targetA, "targetB": targetB};
		client.emit("sendPunishment",data);
	}


}

export default connectionEmitter;