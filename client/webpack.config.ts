import path from 'path'
import os from 'os'
import webpack from 'webpack'
import DevServer from 'webpack-dev-server'
import dotenv from 'dotenv-defaults'
import Dotenv from 'dotenv-webpack' // Support for ENV values
import HtmlWebpackPlugin from 'html-webpack-plugin' // Generates index.html
import TerserPlugin from 'terser-webpack-plugin' // Minifies the bundled JS
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

// * Load ENV Variables from the .env and .env.defaults files for use within webpack
dotenv.config()

// * Check if current mode is development
const isDevelopment = process.env.NODE_ENV !== 'production'

interface Configuration extends webpack.Configuration {
    devServer: DevServer.Configuration
}

const Configuration: Configuration = {
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'eval-source-map' : false,

    devServer: {
        contentBase: path.join(__dirname, 'build'),
        port: 3000,
        hot: true,
        historyApiFallback: true,
        open: true,
        openPage: 'http://localhost:3000',
        proxy: {
            [process.env.API_BASE_PATH as string]: process.env.API_URL as string,
        },
        watchOptions: {
            ignored: path.join(os.homedir(), '.tailwindcss', 'touch'),
        },
    },

    // * Support all JS and TS file types and start at src/index.tsx
    resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    entry: { bundle: path.join(__dirname, 'src/index.tsx') },

    // * Use Terser Plugin for minifying the bundle and cache output
    optimization: { minimize: true, minimizer: [new TerserPlugin()], splitChunks: { chunks: 'all' }, usedExports: true },
    cache: true,

    output: {
        path: path.resolve(__dirname, 'build'),
        // for production use [contenthash], for development use [hash]
        filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
    },

    plugins: [
        new HtmlWebpackPlugin({ title: process.env.TITLE, template: 'index.ejs' }),
        new Dotenv({ safe: true, defaults: true, systemvars: true }),
        ...(isDevelopment ? [new webpack.HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()] : []),
        new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
    ],

    module: {
        rules: [
            { test: /\.(css)$/, use: ['style-loader', 'css-loader', 'postcss-loader'], sideEffects: true },
            { test: /\.(scss|sass)$/, use: ['style-loader', 'css-loader', 'sass-loader'], sideEffects: true },
            { test: /\.(png|jpg|gif)$/i, use: ['file-loader'] },
            { test: /\.svg$/, use: '@svgr/webpack' },
            { test: /\.html$/, use: [{ loader: 'html-loader' }] },
            { test: /\.(js|jsx|ts|tsx)$/, exclude: /(node_modules)/, use: ['babel-loader'], sideEffects: false },
        ],
    },
}

export default Configuration
