import PLAYER from "./player/player.js";

class game {
	constructor(){
		this.id = '';
		this.players = [];
        this.maxPlayers = 6;
	}
	setId(gameid){
		this.id = gameid;
	}

	addPlayer(playerID,playerName) {

		if (this.players.length < this.maxPlayers) {
			this.players.push(new PLAYER(playerID, playerName));
			return true;
		} else {
			return false;
		}
	}

	removePlayer(playerName) {
		this.players = this.players.filter( (player) => player.name != playerName);
	}

	findPlayer(id) {
		return this.players[this.players.findIndex( (player) => player.id == id)];
	}

	findPlayerId(id) {
		return this.players.findIndex( (player) => player.id == id);
	}

	getPlayersList() {
		return this.players;
	}

	beginGame() {
        var sendData = {"gameid": this.id, "uid": 1};
        global.emitters.broadcast_gameUpdate(sendData);
        console.log("Waiting for user punishments");
	}

	sendUpdate(){
		var date = new Date().toJSON();
		var sendData = {"gameid": this.id, "uid": 0, "time": date.time};
		global.emitters.broadcast_gameUpdate(sendData);
	}
}

export default game;