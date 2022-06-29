module.exports = {
    run: function (creep) {
        if (creep.memory.full && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.full = false;
        }
        if (!creep.memory.full && creep.store.getFreeCapacity() == 0) {
            creep.memory.full = true;
        }

        if (creep.memory.full) {
            if (creep.room.memory.hasStorage) {
                let storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: { structureType: STRUCTURE_CONTAINER }
                });
                if (storage.store.getFreeCapacity() > 0 && creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
                else {
                    let spawn = creep.pos.findClosestByPath(creep.room.memory.sources);
                    if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                }
            }
            else {
                let spawn = creep.pos.findClosestByPath(creep.room.memory.sources);
                if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            }
        }
        else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};