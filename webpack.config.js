const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        'loop': path.join(__dirname, '/src/loop/index.ts'),
        'utils': path.join(__dirname, '/src/utils/index.ts')
    },
    output: {
        path: path.resolve(__dirname, '_bundles'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'MyLib',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};