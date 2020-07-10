import PLAYER from "./player/player.js";
import EPISODE from "./episode.js";

//Packet IDs for game updates
const upId = {
    STARTGAME: 1
}

class game {
	constructor() {
		this.m_id = '';
		this.m_players = [];
        this.m_maxPlayers = 6;
        this.m_invalidPairs = new Set();
        this.m_episode = new EPISODE(m_maxPlayers);
    }
    
    //Helper Functions

	setId(gameid) {
		this.m_id = gameid;
	}

	addPlayer(playerID,playerName) {
        console.log("PLAYER ID: " + playerID);
		if (this.m_players.length < this.m_maxPlayers) {
			this.m_players.push(new PLAYER(playerID, playerName));
			return true;
		} else {
			return false;
		}
	}

	removePlayer(playerName) {
		this.m_players = this.m_players.filter( (player) => player.name != playerName);
	}

	findPlayer(id) {
		return this.m_players[this.m_players.findIndex( (player) => player.id == id)];
	}

	findPlayerId(id) {
		return this.m_players.findIndex( (player) => player.id == id);
	}

	getPlayersList() {
		return this.m_players;
    }
    
    //Game Functions

    // Function used to test socket communication
    sendUpdate() {
		var date = new Date().toJSON();
        var sendData = {
            "gameid": this.m_id,
            "uid": 0,
            "time": date.time
        };
		global.emitters.broadcast_gameUpdate(sendData);
    }

    sendUserUpdate(id) {
        if (id >= 0 && id < this.m_players.length) {
            var date = new Date().toJSON();
            var player = this.m_players[id];
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
        if (this.m_players.length > 3) {
            var sendData = {
                "gameid": this.m_id,
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
        this.m_players.sort((a,b) => {
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
        this.m_episode.reset();
        this.m_invalidPairs.length = 0;
        this.sendChooser();
    }

    // Move on to the next chooser, if we reach the end of the list then end the round
    nextChooser() {
        if (this.m_episode.incrChooser()) {
            this.sendChooser();
        } else {
            this.endRound();
        }
    }

    // Broadcast to all who is the current chooser
    sendChooser() {
        var sendData = {
            "gameid": this.m_id,
            "uid": 2, //update id
            "pid": this.m_players[this.m_episode.chooser()].id,
            "invalidPairs": this.m_invalidPairs
        };
        global.emitters.broadcast_gameUpdate(sendData);
    }

    // Attempt to set the targets
    setTarget(pair) {
        var sendData = {
            "gameid": this.m_id,
            "uid": 3, //update id
            "valid": false
        }

        if (this.validTarget(pair)) {
            this.m_invalidPairs.add(pair);
            this.m_episode.setTargets(pair);

            // Found a valid pair broadcast to all who the pair is
            sendData.valid = true;
            broadcast_gameUpdate(sendData);
        } else {
            // Pair is rejected try again
            sendData.pid = this.m_players[this.m_episode.chooser()].id;
            broadcast_userUpdate(sendData);
        }
    }

    // Check if this is a valid pair to choose
    validTarget(pair) {
        if (isTarget() && !this.m_invalidPairs.has(pair)) {
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