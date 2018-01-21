var worker = require('role_worker');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        worker.run(creep, this.doWork);        
    },
    doWork: function(creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, 
                { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};
