const fs = require('fs');
const path_module = require('path');
const rewiremockConfig = require('./rewiremock');

// from freakish's answer here 
// https://stackoverflow.com/questions/10914751/loading-node-js-modules-dynamically-based-on-route
function loadModules(path) {
    fs.lstat(path, function(err, stat) {
        if (stat.isDirectory()) {
            // we have a directory: do a tree walk
            fs.readdir(path, function(err, files) {
                const testFiles = files.filter(x => x.includes('.tests.js'));
                for (let i = 0; i < testFiles.length; i++) {
                    const fullPath = path_module.join(path, testFiles[i]);
                    loadModules(fullPath);
                }
            });
        } else {
            // we have a file: load it
            require(path);
        }
    });
}
loadModules(__dirname);
