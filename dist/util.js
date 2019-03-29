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
        let creepData = {};
        creepData[constants.RoleHarvester] = { roleObj: roleHarvester };
        creepData[constants.RoleUpgrader] = { roleObj: roleUpgrader },
        creepData[constants.RoleBuilder] = { roleObj: roleBuilder },
        creepData[constants.RoleHauler] = { roleObj: roleHauler },
        creepData[constants.RoleClaimer] = { roleObj: roleClaimer }
        return creepData;
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
    getRooms: function() {
        // todo use uniqBy when able to
        // _.uniqBy(Game.creeps, c => c.room.name);
        let rooms = [];
        for (let name in Game.creeps) {
            let roomName = Game.creeps[name].room.name;
            if (rooms.find(roomName) == undefined) {
                rooms.push(roomName)
            }
        }
        return rooms;
    }
};