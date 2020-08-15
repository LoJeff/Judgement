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
		//"Truth" for truth, "Dare" for dare
		const client = this.client;
		const data = {"tarVote": tarVote}
		client.emit("tarTODVote", data)
	}

	sigJudgeContGame(){
		//send judge signal to continue game
		const client = this.client;
		client.emit("sigJudgeContGame")
	}

	sendPlayerVote(playerVote){
		//send this player's vote for who won trial
		//sends player ID as a string
		const client = this.client
		const data = {"playerVote": playerVote}
		client.emit("sendPlayerToDChoice", data)

	}
}

export default connectionEmitter;