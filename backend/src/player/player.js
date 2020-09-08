

class PLAYER {
    constructor(pid, name) {
        this.pid = pid;
        this.name = name;
        this.punishment = undefined;
        this.points = 0;
        this.flag = 0;
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

    setPunishment(punishment) {
        this.punishment = punishment;
    }

    addPoints(points) {
        this.points += points;
    }
}

export default PLAYER;