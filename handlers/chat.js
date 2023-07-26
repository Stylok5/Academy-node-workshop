const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const { pipeline } = require('stream');
// const logger = require('../libraries/logger');
const rootDir = process.cwd();
// const { promisify } = require('util');
// const pipelineAsync = promisify(pipeline);
// const readable = fs.createReadStream("input.text");

/**
 *
 * Task 1: Create a handler that responds with html
 *
 * Use the fs module to read the chat.html file as a stream and send it
 * as the response. (try first with the fs.readFile API)
 *
 * Hint: Use the pipe operator between the fs and response streams
 *       (Fun-Fact: The response object is also a stream thus pipeable)
 *
 */

const get = ({ response }) => {
  // implementation
  const filePath = path.join(rootDir, 'views/chat.html');
  const readStream = fs.createReadStream(filePath);
  const writable = response;
  response.setHeader('Content-Type', 'text/html');

  (async function run() {
    try {
      await pipeline(readStream, writable, (error) => {
        if (error) {
          console.error('pipeline failed with error:', error);
          response.writeHead(500);
          response.end('Internal Server Error');
        } else {
          console.log('pipeline accomplished.');
        }
      });
    } catch (err) {
      console.error('pipeline failed with error:', err);
    }
  })();

  // readStream.on('error', (error) => {
  //   console.error(error);
  //   response.writeHead(500);
  //   response.end('Internal Server Error');
  // });

  // response.setHeader('Content-Type', 'text/html');
  // readStream.pipe(response);
};

/**
 *
 * Task 2: Create a handler that responds with JSON
 *
 * Use the global JSON object to create a JSON response containing a new
 * chat username. e.x { username: 'user_fh23FFGJ' }
 *
 * Hint 1: Use the async stringify method from the JSON global
 * Hint 2: Use 'shortid.generate()' to create a random ID for the username
 *
 */

const getUsername = async ({ response }) => {
  // implementation
  try {
    const username = { username: `user_${shortid.generate()}` };
    const json = JSON.stringify(username);

    response.setHeader('Content-Type', 'application/json');
    response.writeHead(200);
    response.end(json);
  } catch (error) {
    console.error(error);
    response.writeHead(500);
    response.end('Internal Server Error');
  }
};

module.exports = { get, getUsername };
