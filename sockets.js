const socketIO = require('socket.io');
const { Model: MessageModel } = require('./models/message');
const { messagesPerMinute } = require('./utilities');

const init = async server => {
  // server start time
  const startTime = Math.round(new Date().getTime() / 1000);

  // initialize socket.io
  const io = socketIO(server);

  // initialize analytics object
  const analytics = {
    connected: 0,
    totalMessages: 0,
    perMinute: 0,
  };

  // get total messages when server starts
  const totalMessages = await MessageModel.countDocuments({}).exec();
  analytics.totalMessages = totalMessages;

  /**
   *
   *  Task 1: Update analytics and notify the connected clients.
   *
   *  The analytics object holds some metrics about the chat server.
   *  When a client connects/disconnects or sends a new message
   *  update the analytics and broadcast them to all clients.
   *
   *  Task 2: Update the 'messagesPerMinute' metric in regular intervals.
   *
   *  Calculating the messagesPerMinute metric after every new message will
   *  probably decrease the server's performance. For that reason move the
   *  messagesPerMinute calculation into a 5 sec period and then broadcast
   *  the updated analytics to the clients.
   *
   *  **Hints**
   *
   *  - Use the following code to calculate the messagesPerMinute metric
   *
   *  const messages = await MessageModel.find({ timestamp: { $gte: startTime } })
   *   .sort({ timestamp: 1 })
   *   .exec();
   *
   *  const mpm = messagesPerMinute(messages).toFixed(2);
   *
   */

  io.on('connection', socket => {
    socket.on('client:message', async data => {
      // create and save new message to database
      const message = await MessageModel.create({
        text: data.text,
        username: data.username,
      });

      // broadcast new message to everyone
      io.emit('server:message', message);
    });
  });
};

module.exports = {
  init,
};