const fs = require('fs');
const path_module = require('path');

const setup = 'setup';

// from freakish's answer here 
// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route
function loadModules(path) {
    fs.lstat(path, function(err, stat) {
        if (stat.isDirectory()) {
            // we have a directory: do a tree walk
            fs.readdir(path, function(err, files) {
                const testFiles = files.filter(x => 
                    x.includes('.tests.js') || x.includes('.screeps.js'));
                for (let i = 0; i < testFiles.length; i++) {
                    const fullPath = path_module.join(path, testFiles[i]);
                    loadModules(fullPath);
                }
            });
        } else {
            // we have a file: load it
            const requireReturn = require(path);
            const fns = Object.entries(requireReturn);
            // each element of fn is a 2 element array with a string of the function name
            // as the 0th element and the actual function as the 1 index element
            let setupFn;
            const fnNames = fns.map(x => x[0]);
            if (fnNames.includes(setup)) {
                setupFn = fns.find(x => x[0] == setup);
            }
            const fnsToCall = fns.filter(x => x[0] !== setup);
            fnsToCall.map(x => {
                // call setup
                if (setupFn) setupFn[1]();
                // call test
                // console.log('running ' + x[0]);
                x[1]();
            } );
        }
    });
}
loadModules(__dirname);
