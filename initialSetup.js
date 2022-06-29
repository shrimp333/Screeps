module.exports = {
    run: function (room, name) {
        room.memory.isSetup = true;
        room.memory.hasStorage = false;
        let sources = room.find(FIND_SOURCES)
        room.memory.sources = sources;
    }
}