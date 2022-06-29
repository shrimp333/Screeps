module.exports = {
    run: function(creep) {

        if (creep.memory.full && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.full = false;
        }
        if (!creep.memory.full && creep.store.getFreeCapacity() == 0) {
            creep.memory.full = true;
        }

        let site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (creep.memory.full && site != null && creep.build(site) == ERR_NOT_IN_RANGE) {
            creep.moveTo(site);
        }
        else if (creep.memory.full && site == null) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            targets.sort((a,b) => a.hits - b.hits);
            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
        else if (creep.room.memory.hasStorage && !creep.memory.full){
            let storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER }
            });
            if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
        else if (!creep.memory.full) {
            let source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (source != null){
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            else {
                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
                targets.sort((a,b) => a.hits - b.hits);
                if(targets.length > 0) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            }
        }
    }
}