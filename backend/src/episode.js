class EPISODE {
    constructor() {
        this.m_num_players = 0;
        this.m_num_targets = 2;
        this.m_cur_judge = 0;
        this.m_responses = new Set();
        this.m_target_id_hash = new Set();
        this.hardReset();
    }

    hardReset() {
        this.m_cur_judge = 0;
        this.softReset();
    }

    softReset() {
        this.m_targets = [];
        this.m_tod_choice = [0, 0]
        this.m_responses.clear();
        this.m_prompt = "";
        this.m_vote = [];
        this.m_target_id_hash.clear();

        this.m_vote_sorted = false;
    }

    resetNumResponses() {
        this.m_responses.clear();
    }

    // Setter Functions
    setNumPlayers(numPlayers) {
        this.m_num_players = numPlayers;
    }
    
    setTargets(targets) {
        this.m_targets = targets;
        for (var i = 0; i < this.m_num_targets; i++) {
            this.m_vote.push({
                "pidx": this.m_targets[i],
                "count": 0,
                "order": Number.MAX_SAFE_INTEGER
            });
        }
    }

    setJudge(id) {
        this.m_cur_judge = id;
        this.m_episode.softReset();
    }

    setPrompt(prompt) {
        this.m_prompt = prompt;
    }

    addTarIdSet(pid) {
        this.m_target_id_hash.add(pid);
    }

    // Getter Functions
    maxTargets() {
        return this.m_num_targets;
    }

    target(pos) {
        console.assert(pos >= 0 && pos < this.m_num_targets);
        return this.m_targets[pos];
    }

    targets() {
        return this.m_targets;
    }

    judge() {
        return this.m_cur_judge;
    }

    cid() {
        return this.m_cid;
    }

    truth() {
        return this.m_tod_choice[0] > this.m_tod_choice[1];
    }
    
    dare() {
        return this.m_tod_choice[0] < this.m_tod_choice[1];
    }

    prompt() {
        return this.m_prompt;
    }

    // Check if this is a legal pair of targets
    isValidTarget(pair) {
        if (pair.length != this.m_num_targets) {
            return false;
        }

        for (var i = 0; i < this.m_num_targets; i++) {
            if (!Number.isInteger(pair[i])) return false;
        }

        for (var i = 0; i < this.m_num_targets; i++) {
            if (pair[i] >= this.m_num_players || pair[i] < 0 || 
                pair[i] == this.m_cur_judge) return false;
        }
        return true;
    }

    isTargetId(pid) {
        return this.m_target_id_hash.has(pid);
    }

    // Two targets choose if they want truth or dare
    tarChooseTOD(choice, pid) {
        if (choice != 0 && choice != 1) return false;
        // Player has already made a choice
        if (this.m_responses.has(pid)) return false;

        if (this.m_responses.size < this.m_num_targets - 1) {
            this.m_tod_choice[choice]++;
            this.m_responses.add(pid);
            return false;
        } else if (this.m_responses.size == this.m_num_targets - 1) {
            this.m_tod_choice[choice]++;
            if (this.m_tod_choice[0] == this.m_tod_choice[1]) {
                this.m_tod_choice[Math.round(Math.random())]++;
            }
            return true;
        }
    }

    // One player's vote
    playerVote(vote, pid, isJudge) {
        // m_vote was sorted and can no longer be modified
        console.assert(!this.m_vote_sorted);
        // All players have already voted
        if (this.m_responses.size >= this.m_num_players) return true;
        // Valid vote
        if (!(this.m_targets.length > vote && vote >= 0)) return false;
        // Player has already voted
        if (this.m_responses.has(pid)) return false;

        var inc = 1;
        if (isJudge) inc += 2;

        this.m_responses.add(pid);
        this.m_vote[vote].count += inc;

        if (this.m_vote[vote].order == Number.MAX_SAFE_INTEGER) {
            this.m_vote[vote].order = this.m_responses.size;
        }
        return this.m_responses.size >= this.m_num_players;
    }

    // Sort the votes and return the ranking
    getRanking() {
        if (!this.m_vote_sorted) {
            this.m_vote.sort(function(a, b) {
                if (a.count == b.count) {
                    return b.order - a.order;
                } else {
                    return b.count - a.count;
                }
            })
            this.m_vote_sorted = true;
        }
        return this.m_vote;
    }
}

export default EPISODE;