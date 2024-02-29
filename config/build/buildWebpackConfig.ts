import webpack from "webpack";

import { BuildOptions } from "./types/config";
import { buildPlugins } from "./buildPlugins";
import { buildLoaders } from "./buildLoaders";
import { buildResolvers } from "./buildResolvers";
import { buildDevServer } from "./buildDevServer";

export const buildWebpackConfig = (options: BuildOptions): webpack.Configuration => {
    const { mode, isDev, paths } = options;

    return {
        mode,
        entry: paths.entry,
        devtool: isDev && "inline-source-map",
        output: {
            filename: "[name].[contenthash].js",
            path: paths.build,
            clean: true,
        },
        plugins: buildPlugins(options),
        module: {
            rules: buildLoaders(options),
        },
        resolve: buildResolvers(options),
        devServer: isDev && buildDevServer(options),
    };
};
