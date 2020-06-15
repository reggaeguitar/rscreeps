const worker = require('./role_worker');
const logger = require('./logger');

module.exports = {
    run: function(creep) {
        worker.run(creep, this.doWork);        
    },
    doWork: function(creep) {
        const isNotInRange = creep.upgradeController(creep.homeRoom.controller) == ERR_NOT_IN_RANGE;
        //logger.log('./in upgrader.doWork', {isNotInRange});
        if (isNotInRange) {
            creep.moveTo(creep.homeRoom.controller, 
                { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};
