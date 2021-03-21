import * as path from 'path'
import * as webpack from 'webpack'
import dotenv from 'dotenv-defaults'
import Dotenv from 'dotenv-webpack' // Support for ENV values
import HtmlWebpackPlugin from 'html-webpack-plugin' // Generates index.html
import TerserPlugin from 'terser-webpack-plugin' // Minifies the bundled JS
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

// * Load ENV Variables from the .env and .env.defaults files for use within webpack
dotenv.config()

// * Check if current mode is development
const isDevelopment = process.env.NODE_ENV !== 'production'

const Configuration: webpack.Configuration = {
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'eval-source-map' : false,

    devServer: {
        contentBase: path.join(__dirname, 'build'),
        port: 3000,
        hot: true,
        historyApiFallback: true,
        open: true,
    },

    // * Support all JS and TS file types and start at src/index.tsx
    resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    entry: { bundle: path.join(__dirname, 'src/index.tsx') },

    // * Use Terser Plugin for minifying the bundle and cache output
    optimization: { minimize: true, minimizer: [new TerserPlugin()] },
    cache: true,

    output: {
        path: path.resolve(__dirname, 'build'),
        // for production use [contenthash], for development use [hash]
        filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
    },

    plugins: [
        ...(isDevelopment ? [new ReactRefreshWebpackPlugin()] : []),
        new HtmlWebpackPlugin({ title: process.env.TITLE, template: 'index.ejs' }),
        // new FaviconsWebpackPlugin({
        //     // Your source logo (required)
        //     logo: path.resolve(__dirname, 'src/images/logo.svg'),
        //     // Enable caching and optionally specify the path to store cached data
        //     // Note: disabling caching may increase build times considerably
        //     cache: true,
        //     inject: true,
        //     mode: isDevelopment ? 'light' : 'webapp',
        //     favicons: { orientation: 'portrait', start_url: '/' },
        // }),
        new Dotenv({ safe: true, defaults: true, systemvars: true }),
    ],

    module: {
        rules: [
            { test: /\.(css|scss|sass)$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            { test: /\.(png|jpg|gif)$/i, use: ['file-loader'] },
            { test: /\.svg$/, use: '@svgr/webpack' },
            { test: /\.html$/, use: [{ loader: 'html-loader' }] },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                            plugins: [...(isDevelopment ? ['react-refresh/babel'] : [])],
                        },
                    },
                    'ts-loader',
                ],
            },
        ],
    },
}

export default Configuration
