import PLAYER from "./player/player.js";
import EPISODE from "./episode.js";

// game states
const state = {
    PREGAME: 0,
    PUNISHMENT: 1,
    CHOOSETARGET: 2,
    TARCHOOSETOD: 3,
    JUDGEPROMPT: 4,
    JUDGECONTTOD: 5,
    VOTE: 6,
    JUDGECONTEP: 7,
    NEXTROUND: 8,
    PUNCONT: 9,
    ENDGAME: 10
}

class game {
	constructor() {
        this.state = state.PREGAME;
		this.m_id = -1;
        this.m_players = [];
        this.m_max_players = 6;
        this.m_ranking = [];
        this.m_rank_judge_id = 0;
        this.m_invalid_sets = {};
        this.m_id_to_name = [];
        this.m_episode = new EPISODE();
        this.m_cur_round = 0;
        this.m_num_rcvd = 0;
        this.m_cur_rules = [];

        // Game Settings
        this.m_num_rounds = 3;
        this.m_enable_rewards = true;
        this.m_rewards = [[]];

        this.m_rewards.sort((a, b) => {
            return a[0] - b[0];
        });
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
            this.m_ranking.push({"id": this.m_players.length, "points": 0, "rank":-1});
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
        if (this.state != state.PREGAME) return;
        if (this.m_players.length >= 3) {
            this.m_episode.setNumPlayers(this.m_players.length);
            this.state = state.PUNISHMENT;
            global.emitters.bro_beginGame(this.m_id);
        } else {
            global.emitters.sig_notEnoughPlayers(pid);
        }
    }

    // Receive punishment from a user
    rcvPunish(pid, punishment) {
        if (this.state != state.PUNISHMENT) return;
        if (this.m_num_rcvd == this.m_players.length) return;

        var idx = this.findPlayerId(pid);
        // Check if punishment was already provided by this player
        if (this.m_players[idx].getPunishment() == undefined) {
            this.m_players[idx].setPunishment(punishment);
            this.m_num_rcvd++;
            global.emitters.sig_punishmentRcvd(pid);
        }

        // Check if everyone has provided a punishment
        if (this.m_num_rcvd == this.m_players.length) {
            this.startRound();
        }
    }

    // Sorting all players based on their current points
    sortByRanking() {
        if (this.m_ranking.length < 2) return;
        // Update Points
        for (var i = 0; i < this.m_ranking.length; i++) {
            this.m_ranking.points = this.m_players[this.m_ranking[i].id].getPoints();
        }
        // Sort Ranking
        this.m_ranking.sort((a,b) => {
            if (a.points == b.points) {
                return b.id - a.id;
            } else {
                return b.points - a.points;
            }
        });
        // Update Rank
        this.m_ranking[0].rank = 1;
        for (var i = 1; i < this.m_ranking.length; i++) {
            if (this.m_ranking[i].points == this.m_ranking[i-1].points) {
                this.m_ranking[i].rank = this.m_ranking[i-1].rank;
            } else {
                this.m_ranking[i].rank = i+1;
            }
        }
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
        this.state = state.CHOOSETARGET;
        global.emitters.bro_curJudge(this.m_id, this.m_players[this.m_episode.judge()].getName());
        global.emitters.sig_imJudge(this.m_players[this.m_episode.judge()].pid,
            this.m_invalid_sets, this.m_id_to_name, this.m_episode.judge());
    }

    pushInvalidTargets(targets) {
        targets.sort();
        this.m_invalid_sets[toString(targets)] = "true";
    }

    // Attempt to set the targets
    setTarget(targets, pid) {
        if (this.state != state.CHOOSETARGET) return;
        if (pid != this.m_players[this.m_episode.judge()].pid) return;

        if (this.validTarget(targets)) {
            // Found valid targets broadcast to all who the targets are
            global.emitters.bro_valTargets(this.m_id, targets);

            this.pushInvalidTargets(targets);
            this.m_episode.setTargets(targets);
            for (var i = 0; i < targets.length; i++) {
                this.m_episode.addTarIdSet(this.m_players[targets[i]].pid);
            }

            // Request for choosing truth or dare to all targets
            this.state = state.TARCHOOSETOD;
            for (var i = 0; i < this.m_episode.maxTargets(); i++) {
                global.emitters.sig_tarChooseTOD(this.m_players[this.m_episode.target(i)].pid);
            }
        } else {
            // Target is rejected try again
            global.emitters.sig_invalTarget(this.m_players[this.m_episode.judge()].pid, targets)
        }
    }

    // Check if this is a valid pair to choose
    validTarget(targets) {
        return this.m_episode.isValidTarget(targets) && !(targets in this.m_invalid_sets);
    }

    // Receiving targets choices of truth or dare
    rcvTarTOD(choice, pid) {
        if (this.state != state.TARCHOOSETOD) return;
        // Check if person trying to vote is one of the targets
        if (!this.m_episode.isTargetId(pid)) return;

        if (this.m_episode.tarChooseTOD(choice, pid)) {
            // broadcast to all users the decision
            global.emitters.bro_tarResultTOD(this.m_id, this.m_episode.truth());

            // ask the judge to provide a prompt
            this.state = state.JUDGEPROMPT;
            global.emitters.sig_judgeChoosePrompt(this.m_players[this.m_episode.judge()].pid, "");

            this.m_episode.resetNumResponses();
        }
    }

    // Receiving judges truth or dare prompt
    rcvJudgePrompt(prompt, pid) {
        if (this.state != state.JUDGEPROMPT) return;
        if (pid != this.m_players[this.m_episode.judge()].pid) return;

        this.m_episode.setPrompt(prompt);
        
        // broadcast to all users what the prompt is
        global.emitters.bro_judgeResultPrompt(this.m_id, this.m_episode.prompt());

        // tell the judge that he/she needs to choose to continue
        this.state = state.JUDGECONTTOD;
        global.emitters.bro_waitForTrial(this.m_id);
        global.emitters.sig_judgeReqCont(this.m_players[this.m_episode.judge()].pid);
    }

    // Receiving judges request to continue to voting
    rcvJudgeCont(pid) {
        if (this.state != state.JUDGECONTTOD) return;
        if (pid != this.m_players[this.m_episode.judge()].pid) return;

        // Broadcast to all to begin voting
        this.state = state.VOTE;
        global.emitters.bro_playerVote(this.m_id, this.m_episode.targets(), this.m_id_to_name);
    }

    // Receiving votes from a player
    rcvVote(vote, pid) {
        if (this.state != state.VOTE) return;
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
            var winner = this.m_players[voteInfo[i].pidx].addPoints(1);
            if (m_enable_rewards) {
                while (winner.getRewardIdx() < this.m_rewards.length 
                        && this.m_rewards[winner.getRewardIdx()][0] <= winner.getPoints()) {
                    winner.addReward(this.m_rewards[winner.getRewardIdx()][1]);
                    winner.incrRewardIdx();
                }
            }

            this.state = state.JUDGECONTEP;
            global.emitters.bro_getResultVote(this.m_id, nameRank);
        }
    }

    // Receive judges request to continue to next episode
    rcvNextEpisode(pid) {
        if (this.state != state.JUDGECONTEP) return;
        if (pid != this.m_players[this.m_episode.judge()].pid) return;
        
        this.nextJudge();
    }

    // Sending rewards that were calculated for passing specific point thresholds
    sendRewards() {
        
    }

    // Display stats and handle events based on number of points earned
	endRound() {
        // Send ranking of players to all players
        this.sortByRanking();
        var rankName = [];
        for (var i = 0; i < this.m_ranking; i++) {
            rankName.push({
                "name": this.m_players[this.m_ranking[i].id].getName(),
                "rank": this.m_ranking[i].rank
            });
        }
        global.emitters.bro_roundRank(this.m_id, rankName);

        this.state = state.NEXTROUND;
        this.m_num_rcvd = 0;
        global.emitters.bro_contNextRound(this.m_id, this.m_players.length);

        // Cleanup and increment
        this.cur_round++;
    }

    // Receiving continue to next round signal
    nextRound(pid) {
        if (this.state != state.NEXTROUND) return;

        if (this.allPlayerContCheck(pid)) {
            // Check if last round has been reached
            if (this.m_cur_round < this.m_num_rounds) {
                this.startRound();
            } else {
                this.endGameRank();
            }
        }
    }

    // Conclude the game, including declaring who has to do punishment
    endGameRank() {
        this.state = state.PUNCONT;
        this.sortByRanking();
        var rankInfo = [];
        for (var i = 0; i < this.m_ranking.length; i++) {
            rankInfo.push({
                "name": this.m_players[this.m_ranking[i].id].getName(),
                "points": this.m_ranking[i].points,
                "punishment": this.m_players[this.m_ranking[i].id].getPunishment()
            })
        }
        global.emitters.bro_endGameRanking(this.m_id, rankInfo);
    }

    // Receiving continue to punishment signal
    rcvContToPunish(pid) {
        if (this.state != state.PUNCONT) return;

        if (allPlayerContCheck(pid)) {
            this.endGamePunish();
        }
    }

    // Sending out the punishments to everyone
    endGamePunish() {
        this.state = state.ENDGAME;
        var randPlayerIdx = Math.floor(Math.random() * this.m_players.length);
        var punChosen = this.m_players[randPlayerIdx].getPunishment();
        var punOwner = this.m_players[randPlayerIdx].getName();
        var punishedName = this.m_players[this.m_ranking[i].id].getName();

        global.emitters.bro_endGamePunish(this.m_id,
            {"punishment": punChosen, "owner": punOwner}, punishedName);
    }

    // Resets player flags
    resetPFlags() {
        for (var i = 0; i < this.m_players.length; ++i) {
            this.m_players[i].flag = 0;
        }
    }

    // Handler for checking if all continues or a force continue is received
    allPlayerContCheck(pid) {
        var pidx = findPlayerId(pid);
        if (this.m_players[pidx].flag == 0) {
            this.m_players[pidx].flag = 1;
            this.m_num_rcvd++;
            if (this.m_num_rcvd < this.m_players.length) {
                global.emitters.bro_contWaitFor(this.m_id,
                    this.m_players.length - this.m_num_rcvd, this.m_players.length);
                if (pidx == 0) {
                    global.emitters.sig_waitForceStart(this.m_players[0].pid);
                }
            }
        }

        if (this.m_num_rcvd == this.m_players.length || (pidx == 0 && this.m_players[0].flag == 1)) {
            // reset all flags
            this.resetPFlags();
            this.m_num_rcvd = 0;
            return true;
        } else {
            return false;
        }
    }
}

export default game;