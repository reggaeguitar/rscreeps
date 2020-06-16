const worker = require('./role_worker');
const logger = require('./logger');

module.exports = {
    run: function(creep) {
        worker.run(creep, this.doWork);        
    },
    doWork: function(creep) {
        const controller = Game.rooms[creep.memory.homeRoom].controller;
        const isNotInRange = creep.upgradeController(controller) == ERR_NOT_IN_RANGE;
        //logger.log('./in upgrader.doWork', {isNotInRange});
        if (isNotInRange) {
            creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};
