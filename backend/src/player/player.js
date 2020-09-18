class PLAYER {
    constructor(pid, name) {
        this.pid = pid;
        this.name = name;
        this.punishment = undefined;
        this.points = 0;
        this.flag = 0;
        this.reward_stage = 0;
        this.rewards = [];
    }

    getName() {
        return this.name;
    }

    getPunishment() {
        return this.punishment;
    }

    getPoints() {
        return this.points;
    }

    getRewardIdx() {
        return this.reward_stage;
    }

    setPunishment(punishment) {
        this.punishment = punishment;
    }

    incrRewardIdx() {
        this.reward_stage++;
    }

    addPoints(points) {
        this.points += points;
    }

    addReward(reward) {
        this.rewards.push(reward);
    }

    clearReward() {
        this.rewards = [];
    }
}

export default PLAYER;