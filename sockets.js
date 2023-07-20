const socketIO = require('socket.io');
const { Model: MessageModel } = require('./models/Message');
const { messagesPerMinute } = require('./libraries/utilities');

const init = async (server) => {
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

  // get messages from the database which are greater or equal from now timestamp
  // and sort them by timestamp in a descending order
  const messages = await MessageModel.find({ timestamp: { $gte: startTime } })
    .sort({ timestamp: 1 })
    .exec();

  const perMinuteMessages = messagesPerMinute(messages).toFixed(2);
  analytics.perMinute = perMinuteMessages;

  io.on('connection', (socket) => {
    analytics.connected++;
    io.emit('analytics', analytics);

    socket.on('disconnect', () => {
      analytics.connected--;
      io.emit('analytics', analytics);
    });
    socket.on('newMessage', async (data) => {
      analytics.totalMessages++;

      const currentTime = Math.round(new Date().getTime() / 1000);
      const timeElapsed = currentTime - startTime;
      analytics.perMinute = (
        analytics.totalMessages /
        (timeElapsed / 60)
      ).toFixed(2);
      io.emit('analytics', analytics);
    });
  });
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
   *  Note: Calculating the messagesPerMinute metric after every new message will
   *  probably decrease the server's performance. For that reason move the
   *  messagesPerMinute calculation into a 5 sec period and then broadcast
   *  the updated analytics to the clients.
   */
  setInterval(async () => {
    const messages = await MessageModel.find({ timestamp: { $gte: startTime}}).sort({ timestamp: 1})
    .exec();

    const perMinuteMessages = messagesPerMinute(messages).toFixed(2);
    analytics.perMinute = perMinuteMessages;

    io.emit('analytics', analytics);},5000);
  };

  io.on('connection', (socket) => {
    socket.on('client:message', async (data) => {
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
