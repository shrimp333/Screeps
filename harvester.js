const { filter } = require("lodash");

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
                    let spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                    if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                }
            }
            else {
                let spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            }
        }
        else {
            let source = creep.pos.findClosestByPath(_.filter(creep.room.find(FIND_SOURCES), function(o) {
                return o.id != '42283eacd108b17819cfd6a7'
            }))
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};