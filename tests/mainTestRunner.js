//require('./harvesterSourceDeciderTests');
const fs = require('fs');
const path_module = require('path');
const module_holder = {};

function LoadModules(path) {
    fs.lstat(path, function(err, stat) {
        if (stat.isDirectory()) {
            // we have a directory: do a tree walk
            fs.readdir(path, function(err, files) {
                const testFiles = files.filter(x => x.includes('.tests.js'));
                for (let i = 0; i < testFiles.length; i++) {
                    const fullPath = path_module.join(path, testFiles[i]);
                    LoadModules(fullPath);
                }
            });
        } else {
            // we have a file: load it
            require(path);
        }
    });
}
var DIR = path_module.join(__dirname);
LoadModules(DIR);

exports.module_holder = module_holder;