const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
// promisify readFile utility
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

/**
 * Task 1: Create variables that point to specific folders
 *
 * Create a variable that points to the project's root directory and another variable
 * that points to the 'static' folder.
 */

const rootDir = process.cwd();
const staticDir = path.join(rootDir, 'static');

/**
 * Task 2: Write the static middleware
 *
 * When a request comes in, get the URL and try to open (from the 'static' folder)
 * a file with the URL as the filename. If the file exists send the contents to the
 * client else call the next middleware
 *
 * Subtask: if path is not file (e.g a route /home) continue the chain..
 *
 */

// remove before start the task

const staticMiddleware = async ({ request, response }, next) => {
  const { url } = request;
  const staticFilePath = path.join(staticDir, url);

  try {
    const staticFileStats = await stat(staticFilePath);

    if (staticFileStats.isFile()) {
      const fileContent = await readFile(staticFilePath, 'utf8');
      const fileExtension = path.extname(staticFilePath);
      let contentType = 'text/plain';

      if (fileExtension === '.css') {
        contentType = 'text/css';
      } else if (fileExtension === '.js') {
        contentType = 'application/javascript';
      } else if (fileExtension === '.png') {
        contentType = 'image/png';
      }
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(fileContent);
      return;
    }
  } catch (error) {
    // File not found in the 'static' folder, try the 'handlers' folder
  }
  const handlersDir = path.join(rootDir, 'handlers');
  const handlersFilePath = path.join(handlersDir, url);

  try {
    const handlersFileStats = await stat(handlersFilePath);

    if (handlersFileStats.isFile()) {
      const fileContent = await readFile(handlersFilePath, 'utf8');
      response.writeHead(200, { 'Content-Type': 'application/javascript' });
      response.end(fileContent);
      return;
    }
  } catch (error) {
    // File not found in both 'static' and 'handlers' folders, continue the chain
  }

  // If the file is not found in either folder, call the next middleware
  next();
};

module.exports = staticMiddleware;
