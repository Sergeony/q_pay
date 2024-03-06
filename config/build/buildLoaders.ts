import webpack from "webpack";

import { BuildOptions } from "./types/config";
import { buildCssLoader } from "./loaders/buildCssLoader";

export const buildLoaders = (options: BuildOptions): webpack.RuleSetRule[] => {
    const { isDev } = options;

    const fileLoader = {
        test: /\.(jpe?g|gif)$/i,
        exclude: /node_modules/,
        use: "file-loader",
    };
    const svgLoader = {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: "@svgr/webpack",
    };
    const babelLoader = {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
    };
    const typescriptLoader = {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
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
