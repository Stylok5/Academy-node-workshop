const fs = require('fs');
const { ENVVALUES } = require('./constants');

/**
 * Task 1:
 *
 * Use the process global to get the current working directory (cwd)
 * Use the path api and update .env path using the path module and the cwd
 */
const ENV_PATH = '.env';

/**
 * Task 2:
 *
 * Use the process global to get the command line arguments passed.
 *
 */
const cliArgs = [];

const getEnvContent = () => {
  /**
   * Task 3:
   *
   * If in cliArgs exists a value which matches a valid env value (e.g PORT | NODE_ENV)
   * e.g PORT=6001, NODE_ENV=development use this value instead of the default.
   *
   */
  const envValues = ENVVALUES.reduce((acc, envValue) => {
    const { name, value } = envValue;

    acc.push(`${name}=${value}`);
    return acc;
  }, []);

  return envValues.join('\n');
};

const createEnv = () => {
  const envFileContent = getEnvContent();

  fs.writeFile(ENV_PATH, envFileContent, 'utf8', err => {
    if (err) {
      throw err;
    }

    console.log('Finished .env configuration');
  });
};

const readEnv = () => {
  fs.readFile(ENV_PATH, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    console.log(`.env configuration: \n${data}\n`);
  });
};

const checkEnv = () => {
  fs.open(ENV_PATH, 'r+', err => {
    if (err) {
      console.log('Starting configuration..');
      return createEnv();
    }

    readEnv();
  });
};

/**
 * Task 4:
 *
 * use the process global object to handle uncaught exception errors
 * you should terminate the process after an error occurs
 */

/**
 * Task 5:
 *
 * If in cliArgs the paremeter 'BYPASS' exists skip the checkEnv
 */
checkEnv();
