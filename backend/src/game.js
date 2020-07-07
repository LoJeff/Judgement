import PLAYER from "./player/player.js";

//Packet IDs for game updates
const upId = {
    STARTGAME: 1
}

class game {
	constructor(){
		this.id = '';
		this.players = [];
        this.maxPlayers = 6;
        this.curChooser = 0;
        this.invalidPairs = new Set();
        this.targets = [];
    }
    
    //Helper Functions

	setId(gameid){
		this.id = gameid;
	}

	addPlayer(playerID,playerName) {
        console.log("PLAYER ID: " + playerID);
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
    
    //Game Functions

    // Function used to test socket communication
    sendUpdate(){
		var date = new Date().toJSON();
        var sendData = {
            "gameid": this.id,
            "uid": 0,
            "time": date.time
        };
		global.emitters.broadcast_gameUpdate(sendData);
    }

    sendUserUpdate(id){
        if (id >= 0 && id < this.players.length) {
            var date = new Date().toJSON();
            var player = this.players[id];
            var sendData = {
                "pid": player.id,
                "uid": 0,
                "time": date.time
            };
            global.emitters.broadcast_userUpdate(sendData);
        }
    }
    
    // Request for all the punishments at the start of the game
	beginGame() {
        if (this.players.length > 3) {
            var sendData = {
                "gameid": this.id,
                "uid": 1 //update id
            };
            global.emitters.broadcast_gameUpdate(sendData);
            console.log("Waiting for user punishments");
        } else {
            console.log("Not enough players");
        }
    }

    // Parser for receiving packets
    update(data) {
        switch(data.upId) {
            // WIP
        }
    }

    // Sorting all players based on their current points
    sortByRanking() {
        this.players.sort((a,b) => {
            if (a.points == b.points) {
                return a.id > b.id;
            } else {
                return a.points > b.points;
            }
        });
    }

    // Reset the round and ask current chooser to make a choice
    startRound() {
        this.sortByRanking();
        this.curChooser = 0;
        this.invalidPairs.length = 0;
        this.sendChooser();
    }

    // Move on to the next chooser, if we reach the end of the list then end the round
    nextChooser() {
        this.curChooser += 1;
        if (this.curChooser < this.players.length - 1) {
            this.sendChooser();
        } else {
            this.endRound();
        }
    }

    // Broadcast to all who is the current chooser
    sendChooser() {
        var sendData = {
            "gameid": this.id,
            "uid": 2, //update id
            "pid": this.players[this.curChooser].id,
            "invalidPairs": this.invalidPairs
        };
        global.emitters.broadcast_gameUpdate(sendData);
    }

    // Attempt to set the targets
    setTarget(pair) {
        var sendData = {
            "gameid": this.id,
            "uid": 3, //update id
            "valid": false
        }

        if (this.verifyTarget(pair)) {
            // Found a valid pair broadcast to all who the pair is
            sendData.valid = true;
            broadcast_gameUpdate(sendData);
        } else {
            // Pair is rejected try again
            sendData.pid = this.players[this.curChooser].id;
            broadcast_userUpdate(sendData);
        }
    }

    // Check if this is a valid pair to choose
    validTarget(pair) {
        if (pair.length() != 2 || !pair[0].isInteger() || !pair[1].isInteger()) {
            return false;
        }

        if (!this.invalidPairs.has(pair)) {
            this.invalidPairs.add(pair);
            this.targets = pair;
            return true;
        }

        return false;
    }

    // Display stats and handle events based on number of points earned
	endRound() {
        // WIP
    }
}

export default game;