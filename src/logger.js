const data = require('./data');
const gameAbstraction = require('./gameAbstraction');

module.exports = {
  fooPropTest: () => 789,
  log: (msg, obj) => {
      if (data.log) {
        if (msg) {
          console.log(msg + ' ');
        }
        console.log(JSON.stringify(obj));       
      }
  },
  email: msg => {
    if (data.notify) gameAbstraction.notify(msg);
  },
};