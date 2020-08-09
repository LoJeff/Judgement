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
        for (var i = 0; i < this.m_num_targets; i++) {
            this.m_vote.push({"idx": i, "count": 0, "order": Number.MAX_SAFE_INTEGER});
        }
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
    }

    setJudge(id) {
        this.m_cur_judge = id;
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
        assert(pos >= 0 && pos < this.m_num_targets);
        return this.m_targets[pos];
    }

    judge() {
        return this.m_cur_judge;
    }

    cid() {
        return this.m_cid;
    }

    truth() {
        return m_tod_choice[0] > m_tod_choice[1];
    }
    
    dare() {
        return m_tod_choice[0] < m_tod_choice[1];
    }

    prompt() {
        return this.m_prompt;
    }

    // Check if this is a legal pair of targets
    isValidTarget(pair) {
        if (pair.length() != this.m_num_targets) {
            return false;
        }

        for (var i = 0; i < this.m_num_targets; i++) {
            if (!pair[i].isInteger()) return false;
        }

        for (var i = 0; i < this.m_num_targets; i++) {
            if (pair[i] >= this.m_num_players || pair[i] < 0) return false;
        }
        return true;
    }

    isTargetId(pid) {
        return m_target_id_hash.has(pid);
    }

    // Increment to the next judge, if we can't increment anymore return false
    incrJudge() {
        if (this.m_cur_judge < this.m_num_players - 1) {
            this.m_cur_judge += 1;
            this.m_episode.softReset();
            return true;
        }
        return false;
    }

    // Two targets choose if they want truth or dare
    tarChooseTOD(choice, pid) {
        if (choice != 0 && choice != 1) return false;
        // Player has already made a choice
        if (this.m_responses().has(pid)) return false;

        if (this.m_responses.size < this.m_num_targets - 1) {
            this.m_tod_choice[choice]++;
            this.m_responses.add(pid);
            return false;
        } else if (this.m_responses.length == this.m_num_targets - 1) {
            this.m_tod_choice[choice]++;
            if (m_tod_choice[0] == m_tod_choice[1]) {
                m_tod_choice[Math.round(Math.random())]++;
            }
            return true;
        }
    }

    // One player's vote
    playerVote(vote, pid) {
        // m_vote was sorted and can no longer be modified
        ASSERT(!this.m_vote_sorted);

        // All players have already voted
        if (this.m_responses().size >= this.m_num_players) return true;
        // Valid vote
        if (!(this.m_targets.length > vote && vote >= 0)) return false;
        // Player has already voted
        if (this.m_responses().has(pid)) return false;

        this.m_responses().add(pid);
        this.m_vote[vote].count++;

        if (this.m_vote[vote].order == Number.MAX_SAFE_INTEGER) {
            this.m_vote[vote].order = this.m_responses.size;
        }
        return this.m_responses().size >= this.m_num_players();
    }

    // Sort the votes and return the ranking
    getEpisodeRanking() {
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