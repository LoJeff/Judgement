

class PLAYER {
    constructor(id, pid, name) {
        this.id = id;
        this.pid = pid;
        this.name = name;
        this.punishment = '';
        this.points = 0;
    }

    setPunishment(punishment) {
        this.punishment = punishment;
    }

    addPoints(points) {
        this.points += points;
    }
}

export default PLAYER;