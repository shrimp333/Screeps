const harvester = require("./harvester");

module.exports = {
    run: function (room) {
        const SPAWN_LIMIT = {
            harvester: 3,
            upgrader: 1,
            builder: 3,
            carry: 3
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
    let energyCap = this.room.energyCapacityAvailable;
    if (harvesterCount == 0) {
        this.spawnCreep([WORK,CARRY,MOVE,CARRY,MOVE],'tempharvest',{memory: {role: 'harvester'}});
    }
    if (carryCount == 0 && room.memory.hasStorage) {
        this.spawnCreep([MOVE,CARRY,CARRY,MOVE,CARRY,MOVE],'tempcarry',{memory: {role: 'carry'}});
    }
    if (harvesterCount < harvesterLimit) {
        if(energyCap >= 550) {

        }
        else {
            this.spawnWorker('harvester');
        }
    }
    else if(carryCount < carryLimit && room.memory.hasStorage) {
        this.spawnCarry();
    }
    else if (upgraderCount < upgraderLimit) {
        this.spawnWorker('upgrader');
    }
    else if (builderCount < builderLimit) {
        this.spawnWorker('builder');
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
    let pointsAvailable = energyCap;

    while(pointsAvailable > 0) {
        if (pointsAvailable >= 200) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
            pointsAvailable -= 200;
        }
        else if (pointsAvailable >= 100) {
            body.push(CARRY);
            body.push(MOVE);
            pointsAvailable -= 100;
        }
        else if (pointsAvailable >= 50) {
            body.push(MOVE);
            pointsAvailable -= 50;
        }
        else {
            break;
        }
    }
    this.spawnCreep(body,name,{memory: creepMemory});
}

StructureSpawn.prototype.spawnCarry = function () {
    function generatenName() {
        let name;
        let isNameTaken;
        do {
            name = Game.time * Math.random();
            isNameTaken = Game.creeps[name] !== undefined;
        } while (isNameTaken);

        return `carry${name}`.substring(0, 15).replace('.', '');
    }

    let energyCap = this.room.energyCapacityAvailable;
    let name = generatenName();
    let body = [];
    let creepMemory = {
        full: false,
        role: 'carry',
        home: this.room.name
    };
    let pointsAvailable = energyCap;

    while(pointsAvailable > 0) {
        if (pointsAvailable >= 100) {
            body.push(CARRY);
            body.push(MOVE);
            pointsAvailable -= 100;
        }
        else if (pointsAvailable >= 50) {
            body.push(MOVE);
            pointsAvailable -= 50;
        }
        else {
            break;
        }
    }
    this.spawnCreep(body,name,{memory: creepMemory});
}

StructureSpawn.prototype.spawnBigHarvester = function () {
    function generatenName(prefix) {
        let name;
        let isNameTaken;
        do {
            name = Game.time * Math.random();
            isNameTaken = Game.creeps[name] !== undefined;
        } while (isNameTaken);

        return `${prefix}${name}`.substring(0, 15).replace('.', '');
    }

    let name = generatenName('harvester');
    let body = [];
    let creepMemory = {
        full: false,
        role: 'harvester',
        home: this.room.name
    };
    
    this.spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE],name,{memory: creepMemory});
}