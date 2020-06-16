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
  email: function (msg) {
    if (data.notify) {
        this.log(msg);
        gameAbstraction.notify(msg);
    }
  },
};