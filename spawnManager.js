const harvester = require("./harvester");

module.exports = {
    run: function (room) {
        const SPAWN_LIMIT = {
            harvester: 1,
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
    if (harvesterCount < harvesterLimit) {
        if(energyCap >= 550) {
            this.spawnBigHarvester()
        }
        else {
            this.spawnHarvester(false);
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
    if (harvesterCount == 0) {
        this.spawnHarvester(true);
    }
    if (carryCount == 0 && room.memory.hasStorage) {
        this.spawnCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],'tempcarry',{memory: {
            role: 'carry',
            full: false,
            home: this.room.name
        }});
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
StructureSpawn.prototype.spawnHarvester = function(temp) {
    function generatenName() {
        let prefix = 'harvester'
        let name;
        let isNameTaken;
        do {
            name = Game.time * Math.random();
            isNameTaken = Game.creeps[name] !== undefined;
        } while (isNameTaken);

        return `${prefix}${name}`.substring(0, 20).replace('.', '');
    }

    let name = generatenName()
    let assignedSource;
    let body = [];
    let sources = this.room.sources
    for(let i = 0; i < sources.length; i++) {
        if (sources[i].amountWorkers > sources[i].workersAssigned && !sources[i].bigAssigned) {
            assignedSource = sources[i].object;
        }
    }
    let creepMemory = {
        full: false,
        role: 'harvester',
        home: this.room.name,
        source: assignedSource
    };
    if(temp) {
        body = [WORK,CARRY,MOVE,CARRY,MOVE]
    }
    else {
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

        return `${prefix}${name}`.substring(0, 20).replace('.', '');
    }

    let name = generatenName('bigHarvester');
    let creepMemory = {
        full: false,
        role: 'bigHarvester',
        home: this.room.name
    };
    
    this.spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE],name,{memory: creepMemory});
}