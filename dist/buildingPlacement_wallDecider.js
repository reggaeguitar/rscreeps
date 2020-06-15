module.exports = {
    getWallAndRampartLocations: function(room) {
        // make sure roads are built or sites placed first
        // build ramparts over road squares
        // look at each square along the edge
        // if it's not a wall then build a wall three squares away and flip wallMode = true
        // once another wall found when wallMode == true, then build out from that square 2 spaces
        // make sure to put a rampart in middle 
        // top      
        // bottom
        // left
        // right
        console.log('foo');
    },
}