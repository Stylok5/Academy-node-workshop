const { ENVVALUES } = require('./constants');

const ENV_PATH = '.env'; // path to the .env file
const LOGS_DIR = './logs'; // path to the logs directory

// Don't edit
const nwsGetEnvContent = () => {
  const envValues = ENVVALUES.reduce((acc, envValue) => {
    const { name, value } = envValue;

    return [...acc, `${name}=${value}`];
  }, []);

  return envValues.join('\n');
};

/**
 * Task 1: checkEnv implementation
 *
 * Use the fs apis to check if a .env file exists in the root directory.
 *
 * If the file does not exists call the createEnv function and create a .env file.
 * If the file exists call the readEnv function to read the contents of the file.
 * Finally check if a folder with name "logs" exists (LOGS_DIR) in the root directory. If not exists create it.
 *
 * Note: use appropriate flag for read and writing.
 * Note: if an error occurs throw an exception.
 */

function checkEnv() {
  /**
   * Subtask 1:
   *
   * use the os module and print the following information to the console:
   * `running on darwin x64 v19.0.3 and the 56% of your RAM is free. }`;
   */
  // TODO: provide implementation
}

/**
 * Task 2: readEnv implementation
 *
 * Use the fs apis to read the content of the .env file and print it to
 * the console. Each value has to be printed in a new line.
 *
 * Note: use utf8 encoding.
 * Note: if an error occurs throw an exception.
 */

function readEnv() {
  // TODO: provide implementation
}

/**
 * Task 3: createEnv implementation
 *
 * Use the fs apis to write the content values (envFileContents variable) 
 * to a file with name .env in the root directory.
 * When the operation completes print the message 'Finish configuration.' to the console.
 
 * Note: use utf8 encoding.
 * Note: if an error occurs throw an exception.
 */

function createEnv() {
  const envFileContents = nwsGetEnvContent();
  // TODO: provide implementation
}

// starting point
checkEnv();
