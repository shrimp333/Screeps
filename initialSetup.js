module.exports = {
    run: function (room, name) {
        room.memory.isSetup = true;
        room.memory.hasStorage = false;
        room.memory.canBigHarvester = false;
        
        let sources = room.find(FIND_SOURCES);
        let sourceArray = [];
        for (let i = 0; i < sources.length; i++) {
            
            let terrain = room.lookForAtArea(LOOK_TERRAIN,sources[i].pos.y-1,sources[i].pos.x-1,sources[i].pos.y+1,sources[i].pos.x+1,true);
            let num = 0;
            for(let i = 0; i < terrain.length; i++) {
                let land = terrain[i]['terrain'];
                if(land == 'plain' || land == 'swamp')
                    num++;
            }
            sourceArray.push({
                object: sources[i],
                amountWorkers: num,
                workersAssigned: 0
            })
        }
        console.log('adding')
        room.memory.sources = sourceArray;
    }
}