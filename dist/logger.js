const data = require('data');

module.exports = {
  log: (msg, obj) => {
      if (data.log) {
        console.log(msg + ' ' + JSON.stringify(obj));
      }
  },  
};