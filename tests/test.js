const _ = require('lodash');

module.exports = {
    assertEqual: function assertEqualImpl(expected, actual) {
        if (_.isEqual(expected, actual) === false) {
            console.error(`    FAIL: expected ${expected} but got ${actual}`);
        }
    }
};
