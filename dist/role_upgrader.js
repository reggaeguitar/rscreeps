const worker = require('role_worker');
const data = require('data');

module.exports = {
    run: function(creep) {
        worker.run(creep, this.doWork);        
    },
    doWork: function(creep) {
        const isNotInRange = creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE;
        if (data.log) data.logObject('in upgrader.doWork', {isNotInRange});
        if (isNotInRange) {
            creep.moveTo(creep.room.controller, 
                { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};
