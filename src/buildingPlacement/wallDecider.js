module.exports = {
    getWallAndRampartLocations: function(room) {
        // look at each square along the edge
        // if it's not a wall then build a wall two squares away and flip wallMode = true
        // once another wall found when wallMode == true, then build out from that square 2 spaces
        // make sure to put a rampart in middle 
        // (optimization: call describeExits and then Pathfinder and build it on the square on the path)
        // top      
        // bottom
        // left
        // right
        console.log('foo');
    },
}