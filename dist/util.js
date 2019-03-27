const _ = require('lodash');
const constants = require('constants');
const data = require('data');
const roleHarvester = require('role_harvester');
const roleUpgrader = require('role_upgrader');
const roleBuilder = require('role_builder');
const roleHauler = require('role_hauler');
const roleClaimer = require('role_claimer');

module.exports = {
    creepData: () => {
        if (Memory.creepData == undefined) {
            let creepData = {};
            creepData[constants.roleHarvester] = { roleObj: roleHarvester };
            creepData[constants.roleUpgrader] = { roleObj: roleUpgrader },
            creepData[constants.roleBuilder] = { roleObj: roleBuilder },
            creepData[constants.roleHauler] = { roleObj: roleHauler },
            creepData[constants.roleClaimer] = { roleObj: roleClaimer }
            Memory.creepData = creepData;
        }        
        return Memory.creepData;
    },
    
    printCreepRoleCounts: function() {
        if (data.log) console.log(JSON.stringify(this.getCreepRoleCounts()));
    },
    getCreepRoleCounts: function() {
        return _.countBy(Game.creeps, c => c.memory.role);
    },   
    clearDeadCreepsFromMemory: function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];                
            }
        }
    },    
    getCreepCount: function() {
        return Object.keys(Game.creeps).length;
    },
    getRoles: function() {
        return Object.keys(this.creepData);
    },    
};