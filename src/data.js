var roleHarvester = require('role_harvester');
var roleUpgrader = require('role_upgrader');
var roleBuilder = require('role_builder');

module.exports = {
    creepData: {
        'harvester': { roleObj: roleHarvester },
        'upgrader': { roleObj: roleUpgrader },
        'builder': { roleObj: roleBuilder },
    },
    roles: ['harvester', 'upgrader', 'builder']
};