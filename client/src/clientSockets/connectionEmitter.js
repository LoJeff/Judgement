// This class handles all the connection events that
// are emitted from the client
class connectionEmitter {
	constructor(client){
		this.client = client;
	}

	/*
    In/Out: visual(bool)
    */
	sig_visualSupported(visual){
		//sends if Visual prompts are supported
		const client = this.client;
		const data = {"visual": visual};
		client.emit("visualSupported",data);
	}

	/*
	In/Out: gameid(str),
			nickname(str)
    */
	joinGameRoom(nickname,gameid){
		const client = this.client;
		const data = {"gameid": gameid, "name": nickname};
		client.emit("joinGameRoom",data);
	}

	/*
	In/Out: gameid(str),
			nickname(str)
    */
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
		client.emit("Giff's a dummyFunction");
		console.log("emitted Giff's a dummyFunction event");
	}

	/*
	In/Out: punishment(str)
    */
	sendPunishment(punishment){
		const client = this.client;
		const data = {"punishment": punishment};
		client.emit("sendPunishment",data);
	}

	/*
	In/Out: targetSet( array[int] : IDs of targets),
    */
	sendTargets(targetSet){
		const client = this.client;
		const data = {"targetSet": targetSet};
		client.emit("sendTargets",data);
	}
	
	/*
    In/Out: tarVote(str)
    */
	sendTarTODVote(tarVote){
		//send Truth or Dare vote from target
		const client = this.client;
		const data = {"tarVote": tarVote}
		client.emit("tarTODVote", data)
	}

	/*
    In/Out: prompt(str)
    */
	sendJudgePrompt(prompt){
		//send final prompt chosen by judge
		const client = this.client;
		const data = {"prompt": prompt}
		client.emit("sendJudgePrompt", data)
	}

	sig_judgeContGame(){
		//send judge signal to continue game
		const client = this.client;
		client.emit("sig_judgeContGame")
	}

	/*
    In/Out: playerVote(str)
    */
	sendPlayerVote(playerVote){
		//send this player's vote for who won trial
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