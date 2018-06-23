
const StaticServer = require('static-server');
const server = new StaticServer({
    rootPath: '.',
    port: 3000,
    cors: '*'
});

server.start(function() {
    console.log('Server listening to', server.port);
});
