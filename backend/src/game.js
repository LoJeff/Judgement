import PLAYER from "./player/player.js";
import EPISODE from "./episode.js";

// game states
const state = {
    PREGAME: 0,
    STARTGAME: 1
}

class game {
	constructor() {
        this.state = 0;
		this.m_id = -1;
        this.m_players = [];
        this.m_max_players = 6;
        this.m_ranking = [];
        this.m_rank_judge_id = 0;
        this.m_invalid_sets = {};
        this.m_id_to_name = [];
        this.m_episode = new EPISODE();
        this.m_cur_round = 0;
        this.m_num_pun_rcvd = 0;

        this.m_num_rounds = 3;
        this.m_owner_only_continue = true;
    }
    
    //Helper Functions

    getId() {
        return this.m_id;
    }

	setId(gameid) {
        this.m_id = gameid;
    }

	addPlayer(pid,playerName) {
        console.log("PLAYER ID: " + pid);
		if (this.m_players.length < this.m_max_players) {
            this.m_ranking.push({"id": this.m_players.length, "points": 0});
            this.m_id_to_name.push(playerName);
            this.m_players.push(new PLAYER(pid, playerName));
			return true;
		} else {
			return false;
		}
	}

	removePlayer(playerName) {
		this.m_players = this.m_players.filter( (player) => player.getName() != playerName);
	}

	findPlayer(pid) {
		return this.m_players[this.m_players.findIndex( (player) => player.pid == pid)];
	}

	findPlayerId(pid) {
		return this.m_players.findIndex( (player) => player.pid == pid);
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
                "pid": player.pid,
                "uid": 0,
                "time": date.time
            };
            global.emitters.signal_userUpdate(sendData);
        }
    }
    
    // Request for all the punishments at the start of the game
	beginGame(pid) {
        if (this.m_players.length >= 3) {
            this.m_episode.setNumPlayers(this.m_players.length);
            global.emitters.bro_beginGame(this.m_id);
        } else {
            global.emitters.sig_notEnoughPlayers(pid);
        }
    }

    // Receive punishment from a user
    rcvPunish(pid, punishment) {
        if (this.m_num_pun_rcvd == m_players.length) return;

        var idx = findPlayerId(pid);
        if (this.m_players[idx].getPunishment() == undefined) {
            this.m_players[idx].setPunishment(punishment);
            this.m_num_pun_rcvd++;
            sig_punishmentRcvd(pid);
        }

        if (this.m_num_pun_rcvd == m_players.length) {
            this.startRound();
        }
    }

    // Sorting all players based on their current points
    sortByRanking() {
        // Update Points
        for (var i = 0; i < this.m_ranking.length; i++) {
            this.m_ranking.points = this.m_players[this.m_ranking.id].getPoints();
        }
        // Sort Ranking
        this.m_ranking.sort((a,b) => {
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
        this.m_rank_judge_id = 0;
        this.m_invalid_sets = {};
        this.sendJudge();
    }

    // Move on to the next judge, if we reach the end of the list then end the round
    nextJudge() {
        if (this.m_rank_judge_id < this.m_ranking.length - 1) {
            this.m_rank_judge_id += 1;
            this.m_episode.setJudge(this.m_ranking[this.m_rank_judge_id]);
            this.sendJudge();
        } else {
            this.endRound();
        }
    }

    // Broadcast to all who is the current judge
    sendJudge() {
        global.emitters.bro_curJudge(this.m_id, this.m_players[this.judge()].getName());
        global.emitters.sig_imJudge(this.m_players[this.m_episode.judge()].pid,
            this.m_invalid_sets, this.m_id_to_name);
    }

    pushInvalidTargets(targets) {
        targets.sort();
        this.m_invalid_sets[toString(targets)] = "true";
    }

    // Attempt to set the targets
    setTarget(targets, pid) {
        if (pid != this.m_players[this.m_episode.judge()].pid) return;

        if (this.validTarget(targets)) {
            // Found valid targets broadcast to all who the targets are
            bro_valTargets(this.m_id, targets);

            this.pushInvalidTargets(targets);
            this.m_episode.setTargets(targets);
            for (var i = 0; i < targets.length; i++) {
                this.m_episode.addTarIdSet(this.m_players[targets[i]].pid);
            }

            // Request for choosing truth or dare to all targets
            for (var i = 0; i < this.m_episode.maxTargets(); i++) {
                sig_tarChooseTOD(this.m_players[this.m_episode.target(i)].pid);
            }
        } else {
            // Target is rejected try again
            sig_invalTarget(this.m_players[this.m_episode.judge()].pid, targets)
        }
    }

    // Check if this is a valid pair to choose
    validTarget(targets) {
        return this.m_episode.isValidTarget(targets) && !(targets in this.m_invalid_sets);
    }

    // Receiving targets choices of truth or dare
    rcvTarTOD(choice, pid) {
        // Check if person trying to vote is one of the targets
        if (!this.m_episode.isTargetId(pid)) return;

        if (this.m_episode.tarChooseTOD(choice, pid)) {
            // broadcast to all users the decision
            bro_tarResultTOD(this.m_id, this.m_episode.truth());

            // ask the judge to provide a prompt
            sig_judgeChoosePrompt(this.m_players[this.m_episode.judge()].pid, "");

            this.m_episode.resetNumResponses();
        }
    }

    // Receiving judges truth or dare prompt
    rcvJudgeTOD(prompt, pid) {
        if (pid != this.m_players[this.m_episode.judge()].pid) return;

        this.m_episode.setPrompt(prompt);
        
        // broadcast to all users what the prompt is
        bro_judgeResultPrompt(this.m_id, this.m_episode.prompt());

        // tell the judge that he/she needs to choose to continue
        sig_judgeReqCont(this.m_players[this.m_episode.judge()].pid);
    }

    // Receiving judges request to continue to voting
    rcvJudgeCont() {
        if (pid != this.m_players[this.m_episode.judge()].pid) return;

        // Broadcast to all to begin voting
        bro_playerVote(this.m_id, this.m_episode.targets(), this.m_id_to_name);
    }

    // Receiving votes from a player
    rcvVote(vote, pid) {
        // Check if person trying to vote is one of the targets
        if (isTargetId(pid)) return;

        var isJudge = (pid == this.m_players[this.m_episode.judge()].pid);

        if (this.m_episode.playerVote(vote, pid, isJudge)) {
            var nameRank = [];
            var voteInfo = this.m_episode.getRanking();
            for (var i = 0; i < voteInfo.length; i++) {
                nameRank.push({
                    "name": this.m_players[voteInfo[i].pidx].getName(),
                    "vote": voteInfo[i].count
                })
            }
            bro_getResultVote(this.m_id, nameRank);
        }
    }

    // Display stats and handle events based on number of points earned
	endRound() {
        // Send ranking of players to all players
        this.sortByRanking();
        var rankName = [];
        for (var i = 0; i < this.m_ranking; i++) {
            rankName.push(this.m_players[this.m_ranking[i].id].getName());
        }
        bro_roundRank(this.m_id, rankName);

        if (this.m_owner_only_continue) {
            sig_contNextRound(this.m_players[0].pid);
        } else {
            bro_contNextRound(this.m_id);
        }

        // Cleanup and increment
        this.cur_round++;
    }

    // Receiving continue to next round signal
    nextRound(pid) {
        if (this.m_owner_only_continue && pid != this.m_players[0].pid) return;

        // Check if last round has been reached
        if (this.m_cur_round < this.m_num_rounds) {
            this.startRound();
        } else {
            this.endGame();
        }
    }

    // Conclude the game, including declaring who has to do punishment
    endGame() {
        this.sortByRanking();
        var randPlayerIdx = Math.floor(Math.random() * this.m_players.length);
        var punChosen = this.m_players[randPlayerIdx].getPunishment();
        var punOwner = this.m_players[randPlayerIdx].getName();
        var rankInfo = [];
        for (var i = 0; i < this.m_ranking.length; i++) {
            rankNamePoint.push({
                "name": this.m_players[this.m_ranking[i].id].getName(),
                "points": this.m_ranking[i].points,
                "punishment": this.m_players[this.m_ranking[i].id].getPunishment()
            })
        }
    }
}

export default game;