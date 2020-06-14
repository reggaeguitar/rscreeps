const test = require('./test');
const creepSpawn = require('../src/creepUtil');
const rewiremock = require('./rewiremock');

(function creepSpawn_() {
    // arrange
    const creeps = [{ memory: { sourceToHarvest: 0 }, ticksToLive: 1500 }];
    // rewiremock.enable();
    // rewiremock(() => require('../src/logger')).with({ fooTestProp: -37 });
    // rewiremock.disable();
    // rewiremock('../dist/data')
    // .callThrough()
    // .with({ fooTestProp: -37 })
    //.dynamic();
    // const file = rewiremock.proxy('c:/p/rscreeps/dist/data.js', {
    //     'data':  () => -37
    //   });
    // const mock = rewiremock.module(() => import('../dist/data'), {
    //     'data': { name: 'override' }
    //  });

      // use `require` instead of just the filename to maintain type information
// const mock = rewiremock.proxy(() => require('../dist/data'), 
//     {
//     "data": { goodHarvesteWorkCount: 'it works!' }
//     // use all power of rewiremock to mock something as you want...
//     // 'dep2': r.with({name: 'override' }).toBeUsed().directChildOnly(), // use all `mocking API`
//  });

    // act
    const result = creepSpawn.fooTest();

    // assert
    const expected = -37;
    console.log(expected == result);
    test.assertEqual(expected, result);
})();
