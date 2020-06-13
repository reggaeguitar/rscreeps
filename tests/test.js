module.exports = {
    assertEqual: function (expected, actual) {
        console.log('in assertEqual');
        if (expected !== actual) {
            console.log(`expected ${expected} but got ${actual}`)
        } else {console.log('foo')}
    }
};
