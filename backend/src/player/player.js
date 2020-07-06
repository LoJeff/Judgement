

class PLAYER {
    constructor(id, name) {
        this.id = id;
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