const data = require('./data');

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
    if (data.notify) Game.notify(msg);
  },
};