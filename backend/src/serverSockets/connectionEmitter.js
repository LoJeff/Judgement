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

    /*
    In/Out: gameid(str)
    */
    bro_beginGame(gameid) {
        if (this.debug) {
            console.log("Broadcasting Begin Game, waiting for user punishments");
        }
        this.server.to(gameid).emit("beginGame");
    }

    /*
    In/Out: pid(str)
    */
    sig_notEnoughPlayers(pid) {
        if (this.debug) {
            console.log("Not enough players");
        }
        this.server.to(pid).emit("notEnoughPlayers");
    }

    /*
    In/Out: pid(str)
    */
    sig_punishmentRcvd(pid) {
        if (this.debug) {
            console.log("Signal to player " + pid + " punishment has been received");
        }
        this.server.to(pid).emit("punishmentRcvd");
    }

    /*
    In/Out: gameid(str),
            name(str)
    */
    bro_curJudge(gameid, name) {
        if (this.debug) {
            console.log("Broadcasting Current Judge to all");
        }
        this.server.to(gameid).emit("curJudge", {"name": name});
    }

    /*
    In/Out: pid(str),
            invalid_sets(2D array[int] : #invalid sets x #targets in a set),
            id_to_name(array[str] : #players)
    */
    sig_imJudge(pid, invalid_sets, id_to_name) {
        if (this.debug) {
            console.log("Signal to Judge that they are the judge and give non-available pairs");
        }
        this.server.to(pid).emit("imJudge", {"invalidSets": invalid_sets, "idToName": id_to_name});
    }
    
    /*
    In/Out: gameid(str),
            targets(array[int] : #targets in a set)
    */
    bro_valTargets(gameid, targets) {
        if (this.debug) {
            console.log("Broadcast to all current Targets");
        }
        this.server.to(gameid).emit("valTargets", {"targets": targets});
    }

    /*
    In/Out: pid(str),
            targets(array[int] : #targets in a set)
    */
    sig_invalTarget(pid, targets) {
        if (this.debug) {
            console.log("Signal to Judge current Targets are invalid send again");
        }
        this.server.to(pid).emit("invalTargets", {"targets": targets});
    }

    /*
    In/Out: pid(str)
    */
    sig_tarChooseTOD(pid) {
        if (this.debug) {
            console.log("Signal to targets to choose Truth or Dare");
        }
        this.server.to(pid).emit("tarChooseTOD");
    }
    
    /*
    In/Out: gameid(str),
            truth(bool)
    */
    bro_tarResultTOD(gameid, truth) {
        if (this.debug) {
            console.log("Broadcast to all the result of the targets choice between Truth or Dare");
        }
        this.server.to(gameid).emit("tarResultTOD", {"truth": truth});
    }

    /*
    In/Out: pid(str),
            suggestion(str)
    */
    sig_judgeChoosePrompt(pid, suggestion) {
        if (this.debug) {
            console.log("Signal to the judge to choose a prompt, give a suggestion");
        }
        this.server.to(pid).emit("judgeChoosePrompt", {"suggestion": suggestion});
    }
    
    /*
    In/Out: gameid(str),
            prompt(str)
    */
    bro_judgeResultPrompt(gameid, prompt) {
        if (this.debug) {
            console.log("Broadcast to all the prompt that was chosen by the judge");
        }
        this.server.to(gameid).emit("judgeResultPrompt", {"prompt": prompt});
    }

    /*
    In/Out: pid(str)
    */
    sig_judgeReqCont(pid) {
        if (this.debug) {
            console.log("Tell the judge to choose to continue when truth/dares are done");
        }
        this.server.to(pid).emit("judgeReqCont");
    }

    /*
    In/Out: gameid(str)
    */
    bro_waitForTrial(gameid) {
        if (this.debug) {
            console.log("Tell everyone that we are currently in the process of the trial");
        }
        this.server.to(gameid).emit("waitForTrial");
    }
    
    /*
    In/Out: gameid(str),
            targets(array[int] : #targets in a set),
            id_to_name(array[str] : #players)
    */
    bro_playerVote(gameid, targets, id_to_name) {
        if (this.debug) {
            console.log("Judge signals to start voting");
        }
        this.server.to(gameid).emit("playerVote", {"targets": targets, "idToName": id_to_name});
    }
    
    /*
    In/Out: gameid(str)
            vote_result(array[{name(str), vote(int)}] : #targets in a set)
    */
    bro_getResultVote(gameid, vote_results) {
        if (this.debug) {
            console.log("Send result of vote to everyone");
        }
        this.server.to(gameid).emit("resultVote", {"voteResults": vote_results});
    }
    
    /*
    In/Out: gameid(str)
            ranking(array[{name(str), rank(int)}] : #players)
    */
    bro_roundRank(gameid, ranking) {
        if (this.debug) {
            console.log("Sending ranking to all players")
        }
        this.server.to(gameid).emit("roundRank", {"ranking": ranking});
    }

    /*
    In/Out: gameid(str),
            total(int)
    */
    bro_contNextRound(gameid, total) {
        if (this.debug) {
            console.log("Waiting for everyone to continue the game");
        }
        this.server.to(gameid).emit("nextRound", {"total": total});
    }

    /*
    In/Out: gameid(str),
            waiting(int),
            total(int)
    */
    bro_contWaitFor(gameid, waiting, total) {
        if (this.debug) {
            console.log("Waiting for " + waiting + "/" + total + " players to continue the game");
        }
        this.server.to(gameid).emit("contWaitFor", {"waiting": waiting, "total": total});
    }

    /*
    In/Out: pid(str)
    */
    sig_waitForceStart(pid) {
        if (this.debug) {
            console.log("Received continue from room owner, signal that he/she can force start");
        }
        this.server.to(pid).emit("waitForceStart");
    }

    /*
    In/Out: gameid(str),
            rank_info(array[{name(str), points(int), punishment(str)}] : #players)
    */
    bro_endGameRanking(gameid, rank_info) {
        if (this.debug) {
            console.log("End of game, sending ranking to everyone and waiting for continue");
        }
        this.server.to(gameid).emit("endGame", {
            "rankInfo": rank_info
        });
    }
    /*
    In/Out: gameid(str),
            pun_info({punishment(str), owner(str)})
    */
    bro_endGamePunish(gameid, pun_info, name) {
        if (this.debug) {
            console.log("End of game, sending punishment to everyone");
        }
        this.server.to(gameid).emit("endGame", {
            "punInfo": pun_info,
            "punished": name
        });
    }
}

export default connectionEmitter;