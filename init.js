const fs = require('fs');
const { platform, arch, release, totalmem, freemem } = require('os');
const path = require('path');
const { ENVVALUES } = require('./constants');
const logger = require('./libraries/logger');
const { nwsGetEnvContent } = require('./libraries/utilities');

const ENV_PATH = path.join(__dirname, '.env');
const LOG_DIR = path.join(__dirname, './logs');

const args = process.argv.slice(2, process.argv.length);
const bypassCheck = args.some((arg) => arg === '--bypass' || '-b');

/**
 * Task 1: Move to /libraries/utilities.js
 */

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
    ).toFixed(2)} % of your RAM is free.`
  );

  if (bypassCheck) {
    console.log('Bypassing configuration..');
    return;
  }

  fs.stat(LOG_DIR, (err) => {
    if (!err) {
      console.log('file or directory exists');
    } else if (err.code === 'ENOENT') {
      fs.mkdirSync(LOG_DIR);
    }
  });

  try {
    fs.statSync(ENV_PATH);
  } catch (err) {
    if (err.code === 'ENOENT') {
      createEnv();
    }
  }

  readEnv();
}

/**
 * Task 3: Use the logger module to handle logging
 */
logger.log('Hello friend', { key: 'value' }, [1, 2, 3]);

process.on('uncaughtException', (err) => {
  console.log(`pid ${process.pid}\n${err.message}`);
  process.exit(0);
});

// starting point
checkEnv();
