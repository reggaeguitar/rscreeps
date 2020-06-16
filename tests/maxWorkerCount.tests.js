const test = require('./test');
const maxWorkerCount = require('../dist/services_maxWorkerCount');
const util = require('../dist/util');

module.exports = {
    // energy threshold = room.controller.level * energyThreshold
    maxWorkerCount_maxWorkerCount_energyThreshold_setProperly: function() {
        const energyThreshold = 150;
        test.assertEqual(energyThreshold, maxWorkerCount.energyThreshold);
    },
    maxWorkerCount_maxWorkerCount_energyAvailableThreshold_setProperly: function() {
        const energyAvailableThreshold = 0.8;
        test.assertEqual(energyAvailableThreshold, maxWorkerCount.energyAvailableThreshold);
    },
    maxWorkerCount_maxWorkerCount_notEnoughDroppedEnergy_returnsSixForLevelOneController: () => {
        // arrange
        const roomFindDroppedResourcesReturn = [
            {
              "room": {
                "name": "W18S31",
                "energyAvailable": 550,
                "energyCapacityAvailable": 550,
                "visual": {
                  "roomName": "W18S31"
                }
              },
              "pos": {
                "x": 7,
                "y": 29,
                "roomName": "W18S31"
              },
              "id": "5ee6f0d63e1ffd5923e44397",
              "energy": 26,
              "amount": 26,
              "resourceType": "energy"
            },         
        ];

        const roomName = 'E17W34';
        const roomMock = { 
            find: () => roomFindDroppedResourcesReturn,
            controller: { level: 1 },
            name: roomName
        };        
    
        // act
        const result = maxWorkerCount.maxWorkerCount(roomMock, {});
    
        // assert
        const expected = 6;
        test.assertEqual(expected, result);
    },
    maxWorkerCount_maxWorkerCount_notEnoughDroppedEnergy_returnsEightForHigherThanLevelOneController: () => {
        // arrange
        const roomFindDroppedResourcesReturn = [
            {
              "room": {
                "name": "W18S31",
                "energyAvailable": 550,
                "energyCapacityAvailable": 550,
                "visual": {
                  "roomName": "W18S31"
                }
              },
              "pos": {
                "x": 7,
                "y": 29,
                "roomName": "W18S31"
              },
              "id": "5ee6f0d63e1ffd5923e44397",
              "energy": 26,
              "amount": 26,
              "resourceType": "energy"
            },         
        ];

        const roomName = 'E17W34';
        const roomMock = { 
            find: () => roomFindDroppedResourcesReturn,
            controller: { level: 3 },
            name: roomName
        };        
    
        // act
        const result = maxWorkerCount.maxWorkerCount(roomMock, {});
    
        // assert
        const expected = 8;
        test.assertEqual(expected, result);
    },
    maxWorkerCount_maxWorkerCount_lotsOfEnergyInPiles_andLotsAvailable_returnsCurrentWorkerCountPlusOne: () => {
        // energy threshold = room.controller.level * 50
        // arrange
        const roomFindDroppedResourcesReturn = [
            {
              "room": {
                "name": "W18S31",
                "energyAvailable": 550,
                "energyCapacityAvailable": 550,
                "visual": {
                  "roomName": "W18S31"
                }
              },
              "pos": {
                "x": 7,
                "y": 29,
                "roomName": "W18S31"
              },
              "id": "5ee6f0d63e1ffd5923e44397",
              "energy": 226,
              "amount": 226,
              "resourceType": "energy"
            },
            {
              "room": {
                "name": "W18S31",
                "energyAvailable": 550,
                "energyCapacityAvailable": 550,
                "visual": {
                  "roomName": "W18S31"
                }
              },
              "pos": {
                "x": 10,
                "y": 27,
                "roomName": "W18S31"
              },
              "id": "5ee6f0dd5c6dd4ba455e8167",
              "energy": 80,
              "amount": 80,
              "resourceType": "energy"
            },            
        ];

        const roomName = 'E17W34';
        const roomMock = { 
            find: () => roomFindDroppedResourcesReturn,
            controller: { level: 2 },
            name: roomName,
            energyAvailable: 500,
            energyCapacityAvailable: 550
        };
        
        const creepCountsByRoleMock = { foo: "bar" };
        
        const curWorkerCount = 8;
        // since 500 * energyAvailableThreshold 0.8 > 550 (room energyCapacity) increase worker count
        const expected = curWorkerCount + 1;
        
        util.workerCount = (roomNameArg, creepCountsByRoleArg) => {
            if (roomNameArg !== roomName || creepCountsByRoleArg !== creepCountsByRoleMock) {
                return null;
            }
            return curWorkerCount;
        };        
       
    
        // act
        const result = maxWorkerCount.maxWorkerCount(roomMock, creepCountsByRoleMock);
    
        // assert
        test.assertEqual(expected, result);
    },
    maxWorkerCount_maxWorkerCount_lotsOfEnergyInPiles_butNotLotsAvailable_returnsCurrentWorkerCount: () => {
        // energy threshold = room.controller.level * 50
        // arrange
        const roomFindDroppedResourcesReturn = [
            {
              "room": {
                "name": "W18S31",
                "energyAvailable": 550,
                "energyCapacityAvailable": 550,
                "visual": {
                  "roomName": "W18S31"
                }
              },
              "pos": {
                "x": 7,
                "y": 29,
                "roomName": "W18S31"
              },
              "id": "5ee6f0d63e1ffd5923e44397",
              "energy": 226,
              "amount": 226,
              "resourceType": "energy"
            },
            {
              "room": {
                "name": "W18S31",
                "energyAvailable": 550,
                "energyCapacityAvailable": 550,
                "visual": {
                  "roomName": "W18S31"
                }
              },
              "pos": {
                "x": 10,
                "y": 27,
                "roomName": "W18S31"
              },
              "id": "5ee6f0dd5c6dd4ba455e8167",
              "energy": 80,
              "amount": 80,
              "resourceType": "energy"
            },            
        ];

        const roomName = 'E17W34';
        const roomMock = { 
            find: () => roomFindDroppedResourcesReturn,
            controller: { level: 2 },
            name: roomName,
            energyAvailable: 100,
            energyCapacityAvailable: 550
        };

        const creepCountsByRoleMock = { foo: "bar" };

        const curWorkerCount = 8;
        // since 100 * energyAvailableThreshold 0.8 < 550 (room energyCapacity) don't increase worker count
        const expected = curWorkerCount;

        util.workerCount = (roomNameArg, creepCountsByRoleArg) => {
            if (roomNameArg !== roomName || creepCountsByRoleArg !== creepCountsByRoleMock) {
                return null;
            }
            return curWorkerCount;
        };

        // act
        const result = maxWorkerCount.maxWorkerCount(roomMock, creepCountsByRoleMock);
    
        // assert
        test.assertEqual(expected, result);
    },
}
