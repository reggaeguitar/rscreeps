const roles = require('./role_roles');
const roleHarvester = require('./role_harvester');
const roleUpgrader = require('./role_upgrader');
const roleBuilder = require('./role_builder');
const roleHauler = require('./role_hauler');
const roleClaimer = require('./role_claimer');
const roleScout = require('./role_scout');

module.exports = {
    creepData: () => {
        let creepData = {};
        creepData[roles.RoleHarvester] = { roleObj: roleHarvester };
        creepData[roles.RoleUpgrader] = { roleObj: roleUpgrader };
        creepData[roles.RoleBuilder] = { roleObj: roleBuilder };
        creepData[roles.RoleHauler] = { roleObj: roleHauler };
        creepData[roles.RoleClaimer] = { roleObj: roleClaimer };
        creepData[roles.RoleScout] = { roleObj: roleScout };
        return creepData;
    },    
}