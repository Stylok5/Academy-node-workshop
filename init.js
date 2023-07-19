const { cwd, argv } = require('process');
const fs = require('fs');
const path = require('path');
const { platform, arch, release, totalmem, freemem } = require('os');
const { ENVVALUES } = require('./constants');

// const LOG_DIR = './logs';

// Don't edit
const nwsGetEnvContent = () => {
  const envValues = ENVVALUES.reduce((acc, envValue) => {
    const { name, value } = envValue;
    return [...acc, `${name}=${value}`];
  }, []);
  return envValues.join('\n');
};

/**
 * Task 1:
 *
 * Use path module to update the paths below based on the current working directory
 *
 */
// const ENV_PATH = '.env';
const ENV_PATH = path.join(cwd(), '.env');
const LOG_DIR = path.join(cwd(), 'logs');

console.log(`Current directory: ${cwd()}`);
console.log(`ENV_PATH: ${ENV_PATH}`);
console.log(`LOG_DIR: ${LOG_DIR}`);

/**
 * Task 2:
 *
 * Use the process global to get the command line arguments passed.
 *
 */
const args = [];
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});

function createEnv() {
  const envFileContent = nwsGetEnvContent();

  fs.writeFile(ENV_PATH, envFileContent, 'utf8', (err) => {
    if (err) {
      throw err;
    }
    console.log('Finished .env configuration');
  });
}

function readEnv() {
  try {
    const data = fs.readFileSync(ENV_PATH, 'utf8');
    console.log(`Found configuration: \n${data}\n`);
  } catch (error) {
    console.error(error);
  }
}

function checkEnv() {
  console.log(
    `Your Operating System: ${platform()} ${arch()} ${release()}\n${(
      (freemem() / totalmem()) *
      100
    ).toFixed(2)} % of your RAM is free.\n `
  );

  fs.stat(LOG_DIR, (err) => {
    if (!err) {
      console.log('file or directory exists');
    } else if (err.code === 'ENOENT') {
      fs.mkdirSync(LOG_DIR);
    }
  });

  /**
   * Subtask 1:
   *
   * If a command line argument with name '--bypass' or '-b' passed skip the env configuration.
   */
  const skipEnvConfig = argv.includes('--bypass') || argv.includes('-b');
  if (skipEnvConfig) {
    console.log('Env configuration has been skipped.');
  } else {
    try {
      fs.statSync(ENV_PATH);
    } catch (err) {
      if (err.code === 'ENOENT') {
        createEnv();
      }
    }
    readEnv();
  }
}

/**
 * Task 3:
 *
 * Use the process to handle uncaught exception errors
 */

// start here
process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    // eslint-disable-next-line no-useless-concat
    `Caught exception: ${err}\n` + `Exception origin: ${origin}\n`
  );
});
checkEnv();
