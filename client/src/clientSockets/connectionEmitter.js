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

	startGame(){
		const client = this.client;
		client.emit("startGame");
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
		client.emit("sendTargets",data);
	}

	sendTarTODVote(tarVote){
		//send Truth or Dare vote from target
		//"Truth" for truth, "Dare" for dare
		const client = this.client;
		const data = {"tarVote": tarVote}
		client.emit("tarTODVote", data)
	}

	sendJudgePrompt(prompt){
		//send final prompt chosen by judge
		//sends String of prompt
		const client = this.client;
		const data = {"prompt": prompt}
		client.emit("sendJudgePrompt", data)
	}

	sig_judgeContGame(){
		//send judge signal to continue game
		const client = this.client;
		client.emit("sig_judgeContGame")
	}

	sendPlayerVote(playerVote){
		//send this player's vote for who won trial
		//sends player ID as a string
		const client = this.client
		const data = {"playerVote": playerVote}
		client.emit("sendPlayerToDChoice", data)

	}

	sig_contNextRound(){
		//signal current user clicks to continue game from leaderboard
		const client = this.client
		client.emit("sig_contNextRound")
	}

	sig_contToPunishment(){
		//signal current user clicks to continue to final punishment
		const client = this.client
		client.emit("sig_contToPunishment")
	}
}

export default connectionEmitter;