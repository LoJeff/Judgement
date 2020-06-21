

class PLAYER {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.punishment = '';
    }

    setPunishment(punishment) {
        this.punishment = punishment;
    }
}

export default PLAYER;