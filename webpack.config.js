const path = require('node:path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
    const isProd = argv.mode === 'production';
    return {
        mode: isProd ? 'production' : 'development',
        context: path.resolve(__dirname, 'src'),
        entry: './index.js',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js',
            clean: true,
        },

        resolve: {
            extensions: ['.js', '.json'],
        },

        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: 'index.html',
            }),
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: './css/style.[contenthash].css',
            }),
        ],

        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/images/[name].[contenthash][ext]',
                    },
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/fonts/[name].[contenthash][ext]',
                    },
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    type: 'javascript/auto',
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },
            ],
        },
    };
};