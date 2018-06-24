
const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'src/index.ts'),
    target: 'web',
    mode: 'production',
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
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'index.js',
        path: path.join(__dirname, 'browser')
    }
};
