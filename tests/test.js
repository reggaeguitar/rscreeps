const simplemock = require('simple-mock');
const _ = require('lodash');

module.exports = {
    assertEqual: function assertEqualImpl(expected, actual) {
        if (_.isEqual(expected, actual) === false) {
            console.error(assertEqualImpl.caller);
            console.error(`expected ${expected} but got ${actual}`);
        }
    }
};
