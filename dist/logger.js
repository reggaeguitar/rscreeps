const data = require('./data');
const gameAbstraction = require('./gameAbstraction');

module.exports = {
  fooPropTest: () => 789,
  log: function(msg, obj) {
      if (data.log) {
          const logMessage = this.getLogMessage(msg, obj);
          console.log(logMessage);       
      }
  },
  email: function (msg, obj) {
    if (data.notify) {
        this.log(msg, obj);
        const logMessage = this.getLogMessage(msg, obj);
        gameAbstraction.notify(logMessage);
    }
  },
  getLogMessage: (msg, obj) => {
    if (obj) {
        return msg + ' ' + JSON.stringify(obj);
    }
    return msg;
  }
};