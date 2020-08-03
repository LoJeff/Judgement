import PLAYER from "./player/player.js";
import EPISODE from "./episode.js";

//Packet IDs for game updates
const upId = {
    STARTGAME: 1
}

class game {
	constructor() {
		this.m_id = -1;
		this.m_players = [];
        this.m_max_players = 6;
        this.m_invalid_pairs = new Set();
        this.m_episode = new EPISODE();
    }
    
    //Helper Functions

    getId() {
        return this.m_id;
    }

	setId(gameid) {
        this.m_id = gameid;
	}

	addPlayer(playerID,playerName) {
        console.log("PLAYER ID: " + playerID);
		if (this.m_players.length < this.m_max_players) {
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
        if (this.m_players.length >= 3) {
            this.m_episode.setNumPlayers(this.m_players.length);
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
                return b.id - a.id;
            } else {
                return b.points - a.points;
            }
        });
    }

    // Reset the round and ask current judge to make a choice
    startRound() {
        this.sortByRanking();
        this.m_episode.hardReset();
        this.m_invalid_pairs.clear();
        this.sendJudge();
    }

    // Move on to the next judge, if we reach the end of the list then end the round
    nextJudge() {
        if (this.m_episode.incrJudge()) {
            this.sendJudge();
        } else {
            this.endRound();
        }
    }

    // Broadcast to all who is the current judge
    sendJudge() {
        var sendData = {
            "gameid": this.m_id,
            "uid": 2, //update id
            "pid": this.m_players[this.m_episode.judge()].name
        };
        global.emitters.broadcast_gameUpdate(sendData);
        sendData = {
            "gameid": this.m_id,
            "uid": 11, //update id
            "pid": this.m_players[this.m_episode.judge()].id,
            "invalidPairs": this.m_invalid_pairs
        };
        global.emitters.broadcast_userUpdate(sendData);
    }

    // Attempt to set the targets
    setTarget(targets, pid) {
        if (pid != this.m_players[this.m_episode.judge()].id) return;

        if (this.validTarget(targets)) {
            // Found valid targets broadcast to all who the targets are
            var sendData = {
                "gameid": this.m_id,
                "uid": 3, //update id
                "valid": true
            }
            broadcast_gameUpdate(sendData);

            this.m_invalid_pairs.add(targets);
            this.m_episode.setTargets(targets);
            for (var i = 0; i < targets.length; i++) {
                this.m_episode.addTarIdSet(this.m_players[targets[i]].id);
            }

            sendData = {
                "gameid": this.m_id,
                "uid": 4, //update id
                "pid": -1
            }
            // Request for choosing truth or dare to all targets
            for (var i = 0; i < this.m_episode.maxTargets(); i++) {
                sendData.pid = this.m_players[this.m_episode.target(i)].id
                broadcast_userUpdate(sendData);
            }
        } else {
            // Target is rejected try again
            var sendData = {
                "gameid": this.m_id,
                "uid": 3, //update id
                "valid": false,
                "pid": this.m_players[this.m_episode.judge()].id
            }
            broadcast_userUpdate(sendData);
        }
    }

    // Check if this is a valid pair to choose
    validTarget(pair) {
        return this.m_episode.isValidTarget(pair) && !this.m_invalid_pairs.has(pair);
    }

    // Receiving targets choices of truth or dare
    rcvTarTOD(choice, pid) {
        // Check if person trying to vote is one of the targets
        if (!this.m_episode.isTargetId(pid)) return;

        if (this.m_episode.tarChooseTOD(choice, pid)) {
            // broadcast to all users the decision
            var sendData = {
                "gameid": this.m_id,
                "uid": 5, //update id
                "decision": this.m_episode.truth()
            }
            broadcast_gameUpdate(sendData);

            // ask the judge to provide a prompt
            sendData = {
                "gameid": this.m_id,
                "uid": 6, //update id
                "pid": this.m_players[this.m_episode.judge()].id
                // Suggestions for Truth or Dare
            }
            broadcast_userUpdate(sendData);

            this.m_episode.resetNumResponses();
        }
    }

    // Receiving judges truth or dare prompt
    rcvJudgeTOD(prompt, pid) {
        if (pid != this.m_players[this.m_episode.judge()].id) return;

        this.m_episode.setPrompt(prompt);
        
        // broadcast to all users what the prompt is
        var sendData = {
            "gameid": this.m_id,
            "uid": 7, //update id
            "prompt": this.m_episode.prompt()
        }
        broadcast_gameUpdate(sendData);

        // tell the judge that he/she needs to choose to continue
        sendData = {
            "gameid": this.m_id,
            "uid": 8, //update id
            "pid": this.m_players[this.m_episode.judge()].id
        }
        broadcast_userUpdate(sendData);
    }

    // Receiving judges request to continue to voting
    rcvJudgeCont() {
        if (pid != this.m_players[this.m_episode.judge()].id) return;

        var names = [];
        for (var i = 0; i < this.m_episode.maxTargets(); i++) {
            names.push(this.m_players[this.m_episode.target(i)].name);
        }
        var sendData = {
            "gameid": this.m_id,
            "uid": 9,
            "player": names
        }
        broadcast_gameUpdate(sendData);
    }

    // Receiving votes from a player
    rcvVote(vote, pid) {
        // Check if person trying to vote is one of the targets
        if (isTargetId(pid)) return;

        if (this.m_episode.playerVote(vote, pid)) {
            var sendData = {
                "gameid": this.m_id,
                "uid": 10,
                "votes": this.m_episode.getEpisodeRanking()
            }
            broadcast_gameUpdate(sendData);
        }
    }

    // Display stats and handle events based on number of points earned
	endRound() {
        // WIP
    }
}

export default game;