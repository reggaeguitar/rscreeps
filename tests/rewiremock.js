const rewiremock = require('rewiremock/node'); 
// nothng more than `plugins.node`, but it might change how filename resolution works
/// settings
rewiremock.overrideEntryPoint(module); // this is important
rewiremock(() => require('../src/logger')).with({ fooTestProp: -37 });
module.exports = rewiremock;

// import rewiremock, { addPlugin, overrideEntryPoint} from 'rewiremock';
// // do anything you need
// // addPlugin(something);
// // rewiremock('somemodule').with(/*....*/);   

// // but don't forget to add some magic
// overrideEntryPoint(module); // <-- set yourself as top module
// // PS: rewiremock will wipe this module from cache to keep magic alive.
    
// export default rewiremock;