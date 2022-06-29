module.exports = {
    run: function (room) {
        const SPAWN_LIMIT = {
            harvester: 7,
            upgrader: 2,
            builder: 2,
            carry: 1
        }

        if (!room.memory.spawnLimits) {
            room.memory.spawnLimits = {};
        }

        room.memory.spawnLimits = SPAWN_LIMIT;
    }
}

StructureSpawn.prototype.spawnNextCreep = function () {
    let room = this.room;
    let harvesterCount = _.filter(Game.creeps, (creep) => creep.memory.home == room.name && creep.memory.role == 'harvester').length;
    let upgraderCount = _.filter(Game.creeps, (creep) => creep.memory.home == room.name && creep.memory.role == 'upgrader').length;
    let builderCount = _.filter(Game.creeps, (creep) => creep.memory.home == room.name && creep.memory.role == 'builder').length;
    let carryCount = _.filter(Game.creeps, (creep) => creep.memory.home == room.name && creep.memory.role == 'carry').length;

    let harvesterLimit = room.memory.spawnLimits['harvester'];
    let upgraderLimit = room.memory.spawnLimits['upgrader'];
    let builderLimit = room.memory.spawnLimits['builder'];
    let carryLimit = room.memory.spawnLimits['carry'];
    if (harvesterCount < harvesterLimit) {
        this.spawnWorker('harvester');
    }
    else if (upgraderCount < upgraderLimit) {
        this.spawnWorker('upgrader');
    }
    else if (builderCount < builderLimit) {
        this.spawnWorker('builder');
    }
    else if(carryCount < carryLimit) {
        this.spawnWorker('carry');
    }
}
StructureSpawn.prototype.spawnWorker = function (type) {
    function generatenName(prefix) {
        let name;
        let isNameTaken;
        do {
            name = Game.time * Math.random();
            isNameTaken = Game.creeps[name] !== undefined;
        } while (isNameTaken);

        return `${prefix}${name}`.substring(0, 15).replace('.', '');
    }

    let energyCap = this.room.energyCapacityAvailable;
    let name = generatenName(type);
    let body = [];
    let creepMemory = {
        full: false,
        role: type,
        home: this.room.name
    };
    let numOfParts = Math.floor(energyCap / 200);
    let leftEnergy = energyCap % 200;
    let numOfExtra = Math.floor(leftEnergy / 100)

    for(let i = 0; i < numOfParts; i++) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }
    for(let i = 0; i < numOfExtra; i++) {
            body.push(CARRY);
            body.push(MOVE);
    }
    this.spawnCreep(body,name,{memory: creepMemory});
}
