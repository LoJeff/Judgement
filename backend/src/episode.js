class EPISODE {
    constructor(maxPlayers) {
        this.m_maxPlayers = maxPlayers;
        this.m_curChooser = 0;
        this.m_targets = [];
        this.m_truth = 0; //0 not chosen, 1 truth, 2 dare
        this.m_responses = 0;
        this.m_prompt = "";
    }

    reset() {
        this.m_curChooser = 0;
        this.m_targets = [];
        this.m_truth = 0;
        this.m_responses = 0;
    }

    // Setter Functions
    setTargets(pair) {
        this.m_targets = pair;
    }

    setChooser(id) {
        this.m_curChooser = id;
    }

    setPrompt(prompt) {
        this.m_prompt = prompt;
    }

    // Getter Functions
    target(pos) {
        assert(pos == 0 || pos == 1);
        return this.m_targets[pos];
    }

    chooser() {
        return this.m_curChooser;
    }

    cid() {
        return this.m_cid;
    }

    truthOrDare() {
        return this.m_truth;
    }

    prompt() {
        return this.m_prompt;
    }

    // Check if this is a legal pair of targets
    isTarget(pair) {
        if (pair.length() != 2 || !pair[0].isInteger() || !pair[1].isInteger()) {
            return false;
        }

        if (pair[0] < this.m_maxPlayers && pair[0] >= 0 && 
            pair[1] < this.m_maxPlayers && pair[1] >= 0 && pair[0] != pair[1]) {
                return true;
        }
        return false;
    }

    // Increment to the next chooser, if we can't increment anymore return false
    incrChooser() {
        if (this.m_curChooser < this.m_maxPlayers - 1) {
            this.m_curChooser += 1;
            return true;
        }
        return false;
    }

    // Two targets choose if they want truth or dare
    tarChooseTOD(choice) {
        if (this.m_responses == 0) {
            this.m_truth = choice;
            return false;
        } else if (this.m_responses == 1 && this.m_truth != choice) {
            this.m_truth = 0.5 > Math.random();
            return true;
        }
    }
}