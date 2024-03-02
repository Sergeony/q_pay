import webpack from "webpack";

import { BuildOptions } from "./types/config";
import { buildCssLoader } from "./loaders/buildCssLoader";

export const buildLoaders = (options: BuildOptions): webpack.RuleSetRule[] => {
    const { isDev } = options;

    const fileLoader = {
        test: /\.(png|jpe?g|gif)$/i,
        use: "file-loader",
    };
    const svgLoader = {
        test: /\.svg$/,
        use: "@svgr/webpack",
    };
    const babelLoader = {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"],
            },
        },
    };
    const typescriptLoader = {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
    };
    const cssLoader = buildCssLoader(isDev);

    return [
        fileLoader,
        svgLoader,
        babelLoader,
        typescriptLoader,
        cssLoader,
    ];
};
