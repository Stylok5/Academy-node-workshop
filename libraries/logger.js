const fs = require('fs');
const path = require('path');
const { cwd } = require('process');
const { nwsFormatDate, nwsConcatValues } = require('./utilities');

const LOGS_PATH = path.join(cwd(), 'logs');

/**
 * Task 2
 *
 * Implement the logger log function.
 *
 * 1. It should writes debug statements to the console
 * 2. it should writes debug statements to the debug.log file placed in the logs directory.
 * 3. It should writes the timestamp at the beggining of each line
 * 4. Can handle multiple values and types such as <string | object | array> (bonus)
 *
 * Usage:
 * logger.log(value1<string | object | array>, value2)
 *
 * Result:
 * [now, message].
 *
 * e.g
 * ["day:month:year hours:minutes","some info" | { error: 'some error } | ['some item1', 'some item2'], directory]
 */

/**
 * Uncomment the following lines of code before implementing the
 * task. (implement what's needed)
 */

//

try {
  if (!fs.existsSync(LOGS_PATH)) {
    fs.mkdirSync(LOGS_PATH);
  }
} catch (err) {
  console.log(err);
}

const logger = {
  logToFile: true,
  logToConsole: true,
  log(...args) {
    const now = new Date();
    const nowFormat = nwsFormatDate(now);
    const formattedArgs = args.map((arg) => JSON.stringify(arg)).join(', ');

    if (this.logToFile) {
      console.log(`[${nowFormat}, ${formattedArgs}]`);
    }

    if (this.logToFile) {
      const logFilePath = path.join(LOGS_PATH, 'debug.log');
      const logEntry = `[${nowFormat}, ${formattedArgs}]\n`;

      fs.appendFile(logFilePath, logEntry, 'utf8', (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    /**
     * Hint: use the process api to get the path of the logs directory
     */
    /** TODO: provide implementation */
  },
};

module.exports = logger;
