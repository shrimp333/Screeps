const spawnManager = require('./spawnManager');
const initialSetup = require('./initialSetup')
const roles = {
    harvester: require('./harvester'),
    builder: require('./builder'),
    upgrader: require('./upgrader'),
    carry: require('./carry'),
}

module.exports.loop = function () {
    
    for(let name in Game.rooms) {
        let room = Game.rooms[name];
        if (!room.controller || !room.controller.my) {
            continue;
        }
        if(!room.memory.isSetup) {
            initialSetup.run(room);
        }
        spawnManager.run(room, name);
        if(!room.memory.hasStorage) {
            let storages = room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER }
            });
            if(storages.length > 0) {
                room.memory.hasStorage = true;
            }
        }
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        roles[creep.memory.role].run(creep);
    }

    

    for(let name in Game.spawns) {
        let spawn = Game.spawns[name]
        spawn.spawnNextCreep();
    }
}