const _ = require('lodash');
const roles = require('role_roles');
const data = require('data');
const roleHarvester = require('role_harvester');
const roleUpgrader = require('role_upgrader');
const roleBuilder = require('role_builder');
const roleHauler = require('role_hauler');
const roleClaimer = require('role_claimer');

module.exports = {
    // perf cache results from these methods
    creepData: () => {
        let creepData = {};
        creepData[roles.RoleHarvester] = { roleObj: roleHarvester };
        creepData[roles.RoleUpgrader] = { roleObj: roleUpgrader };
        creepData[roles.RoleBuilder] = { roleObj: roleBuilder };
        creepData[roles.RoleHauler] = { roleObj: roleHauler };
        creepData[roles.RoleClaimer] = { roleObj: roleClaimer };
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
    getRoomNames: function() {
        // todo use uniqBy when able to
        // _.uniqBy(Game.creeps, c => c.room.name);
        let _roomCache;
        if (_roomCache != undefined) {
            return _roomCache;
        } else {
            let rooms = [];
            for (let name in Game.creeps) {
                let roomName = Game.creeps[name].room.name;
                if (rooms.find(r => r == roomName) == undefined) {
                    rooms.push(roomName)
                }
            }
            _roomCache = rooms;
            return rooms;
        }
    }
};