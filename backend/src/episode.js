class EPISODE {
    constructor(maxPlayers) {
        this.m_maxPlayers = maxPlayers;
        this.m_curChooser = 0;
        this.m_targets = [];
    }

    reset() {
        this.m_curChooser = 0;
        this.m_targets = [];
    }

    incrChooser() {
        if (this.m_curChooser < this.m_maxPlayers - 1) {
            this.m_curChooser += 1;
            return true;
        }
        return false;
    }

    setChooser(id) {
        this.m_curChooser = id;
    }

    chooser() {
        return this.m_curChooser;
    }

    setTargets(pair) {
        this.m_targets = pair;
    }

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

    targets() {
        return this.m_targets;
    }
}