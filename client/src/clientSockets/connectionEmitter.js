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

	sendTargets(targetPair){
		const client = this.client;
		const data = {"targetPair": targetPair};
		client.emit("sendPunishment",data);
	}

	sendTarTODVote(tarVote){
		//send Truth or Dare vote from target
		//do I need to send who the target is?
		const client = this.client;
		const data = {"tarVote": tarVote}
		client.emit("tarTODVote", data)
	}


}

export default connectionEmitter;