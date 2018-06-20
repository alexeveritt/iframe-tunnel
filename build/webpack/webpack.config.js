
const path = require('path');
const srcPath = getPath('src');

module.exports = {
    entry: `${srcPath}/index.ts`,
    target: 'node',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@src': srcPath,
        }
    },
    output: {
        filename: 'index.js',
        path: getPath('dist'),
        libraryTarget: 'commonjs2'
    }
};

function getPath(appPath) {
    return path.join(__dirname, '../../', appPath);
}

