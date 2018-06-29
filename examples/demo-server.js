const StaticServer = require('static-server');

const server = new StaticServer({
  rootPath: __dirname,
  port: 3000,
  cors: '*'
});

server.start(function() {
  console.log('Server listening to', server.port);
});
