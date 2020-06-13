const data = require('data');

module.exports = {
  log: (msg, obj) => {
      if (data.log) {
        if (msg) {
          console.log(msg + ' ');
        }
        if (obj) {
          console.log(JSON.stringify(obj));
        }
      }
  },
  email: msg => {
    if (data.notify) Game.notify(msg);
  },
};