// This class handles all the game connections socket Emitters
class connectionEmitter{
	constructor(server, debug = false){
        this.server = server;
        this.debug = debug;
	}

	broadcast_updateRoomPlayers(data){
		var sendData = {"playersList":data.playersList};
		this.server.to(data.gameid).emit("updateRoomPlayers",sendData);
	}

	broadcast_chatUpdate(data){
		var sendData = {
			from: data.from,
			content: data.content,
			type: data.type
		};
		this.server.to(data.gameid).emit("updateChat",sendData);
	}

	broadcast_gameUpdate(data){        
		this.server.to(data.gameid).emit("updateGame",data);
    }

    signal_userUpdate(data){
        console.log("Sending to User: " + String(data.pid));
        this.server.to(data.pid).emit("updateUser", data);
    }

    bro_beginGame(gameid) {
        if (this.debug) {
            console.log("Broadcasting Begin Game");
            console.log("Waiting for user punishments");
        }
        this.server.to(gameid).emit("beginGame");
    }

    sig_notEnoughPlayers(pid) {
        if (this.debug) {
            console.log("Not enough players");
        }
        this.server.to(pid).emit("notEnoughPlayers");
    }

    bro_curJudge(gameid, name) {
        if (this.debug) {
            console.log("Broadcasting Current Judge to all");
        }
        this.server.to(gameid).emit("curJudge", {"name": name});
    }

    sig_imJudge(pid, invalid_pairs, id_to_name) {
        if (this.debug) {
            console.log("Signal to Judge that they are the judge and give non-available pairs");
        }
        this.server.to(pid).emit("imJudge", {"invalidPairs": invalid_pairs, "idToName": id_to_name});
    }

    bro_valTargets(gameid, targets) {
        if (this.debug) {
            console.log("Broadcast to all current Targets");
        }
        this.server.to(gameid).emit("valTargets", {"targets": targets});
    }
    
    bro_valTargets(gameid, targets) {
        if (this.debug) {
            console.log("Broadcast to all current Targets");
        }
        this.server.to(gameid).emit("valTargets", {"targets": targets});
    }

    sig_invalTarget(pid, targets) {
        if (this.debug) {
            console.log("Signal to Judge current Targets are invalid send again");
        }
        this.server.to(pid).emit("invalTargets", {"targets": targets});
    }

    sig_tarChooseTOD(pid) {
        if (this.debug) {
            console.log("Signal to targets to choose Truth or Dare");
        }
        this.server.to(pid).emit("tarChooseTOD");
    }

    bro_tarResultTOD(gameid, decision) {
        if (this.debug) {
            console.log("Broadcast to all the result of the targets choice between Truth or Dare");
        }
        this.server.to(gameid).emit("tarResultTOD", {"decision": decision});
    }

    sig_judgeChoosePrompt(pid, suggestion) {
        if (this.debug) {
            console.log("Signal to the judge to choose a prompt, give a suggestion");
        }
        this.server.to(pid).emit("judgeChoosePrompt", {"suggestion": suggestion});
    }

    bro_judgeResultPrompt(gameid, prompt) {
        if (this.debug) {
            console.log("Broadcast to all the prompt that was chosen by the judge");
        }
        this.server.to(gameid).emit("judgeResultPrompt", {"prompt": prompt});
    }

    sig_judgeReqCont(pid) {
        if (this.debug) {
            console.log("Tell the judge to continue when truth/dares are done");
        }
        this.server.to(pid).emit("judgeReqCont");
    }

    bro_playerVote(gameid, targets, id_to_name) {
        if (this.debug) {
            console.log("Judge signals to start voting");
        }
        this.server.to(gameid).emit("playerVote", {"targets": targets, "idToName": id_to_name});
    }

    bro_getResultVote(gameid, vote_results) {
        if (this.debug) {
            console.log("Send result of vote to everyone");
        }
        this.server.to(gameid).emit("resultVote", {"result": vote_results});
    }
}

export default connectionEmitter;