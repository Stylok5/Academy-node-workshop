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

const middleware = async ({ request, response }, next) => {
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
  const { url } = request;
  const finalPath = path.join(staticDir, url);

  try {
    const filesStats = await stat(finalPath);

    if (filesStats.isFile()) {
      const fileContent = await readFile(finalPath, 'utf8');

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(fileContent);
    } else {
      next();
    }
  } catch (error) {
    next();
  }
};

module.exports = middleware;
