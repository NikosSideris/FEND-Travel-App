const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/client/index.js',
    optimization: {
        minimizer: [new TerserPlugin({}),new OptimizeCSSAssetsPlugin({})],
    },
    output: {
        libraryTarget: 'var',
        library: 'Client'
    },
    mode: 'production',
    module: {
        // exprContextRegExp: /^\.\/.*$/,
        // unknownContextRegExp: /^\.\/.*$/,
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader','sass-loader']
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                  'file-loader',
                  {
                    loader: 'image-webpack-loader',
                    options: {
                      name: '[path][name].[ext]',
                      //bypassOnDebug: true, // webpack@1.x
                      disable: true, // webpack@2.x and newer
                      mozjpeg: {
                        progressive: true,
                        quality: 65
                      },
                      optipng: {
                        enabled: false,
                      },
                      pngquant: {
                        quality: [0.65, 0.90],
                        speed: 4
                      },
                      gifsicle: {
                        interlaced: false,
                      },
                      // the webp option will enable WEBP
                      webp: {
                        quality: 75
                      }
                    },
                  },
                ],
              },
    
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new MiniCssExtractPlugin(
            {filename: '[name].css'}
        ),
        new WorkboxPlugin.GenerateSW()
    ]
}
