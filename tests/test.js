module.exports = {
    assertEqual: function assertEqualImpl(expected, actual) {
        if (expected !== actual) {
            console.error(assertEqualImpl.caller);
            console.error(`expected ${expected} but got ${actual}`);
        }
    }
};
