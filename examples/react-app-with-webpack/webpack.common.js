const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')
require('dotenv').config({ path: './.env' });
module.exports = {
    entry: './src/index.tsx',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'AEM Forms - Sample',
            template: "public/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: 'dist/[name].css',
        }),
        new webpack.DefinePlugin({
            process: {
                browser: true,
                env: {
                    REACT_APP_USE_PROXY: `'${process.env.REACT_APP_USE_PROXY}'`,
                    REACT_APP_AEM_FORM_PATH: `'${process.env.REACT_APP_AEM_FORM_PATH}'`,
                    REACT_APP_AEM_AUTH_USER: `'${process.env.REACT_APP_AEM_AUTH_USER}'`,
                    REACT_APP_AEM_AUTH_PASS: `'${process.env.REACT_APP_AEM_AUTH_PASS}'`,
                    REACT_APP_AEM_HOST: `'${process.env.REACT_APP_AEM_HOST}'`,
                }
            }
        }),
    ],
    resolve: {
        // Instead of manually specifying aliases for each dependency, you can rely on Webpack's built-in module resolution.
        //alias: {
        //    ...alias
        //},
        modules: [
            path.resolve(__dirname, 'node_modules'),
            'node_modules',
        ],
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
        //sourceMapFilename: `clientlib-forms-react/resources/[name].map[ext]` // uncomment for debugging
    }
};
