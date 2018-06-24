const path = require('path');
const fs = require('fs');
const StaticServer = require('static-server');

// copy latest browser build to demo
const browserBuild = path.join(__dirname, '../browser/index.js');
copyFile(browserBuild, './iframe-tunnel.js', (err) => {
    if (!err) {
        const server = new StaticServer({
            rootPath: '.',
            port: 3000,
            cors: '*'
        });

        server.start(function() {
            console.log('Server listening to', server.port);
        });
    }

});

function copyFile(source, target, cb) {
    let cbCalled = false;

    const rd = fs.createReadStream(source);

    rd.on("error", err => {
        done(err);
    });

    const wr = fs.createWriteStream(target);
    wr.on("error", err => {
        done(err);
    });
    wr.on("close", () => {
        done();
    });

    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}
