import webpack from "webpack";
import { BuildOptions } from "./types/config";
import { buildPlugins } from "./buildPlugins";
import { buildLoaders } from "./buildLoaders";
import { buildResolvers } from "./buildResolvers";
import { buildDevServer } from "./buildDevServer";

export const buildWebpackConfig = (
    options: BuildOptions
): webpack.Configuration => {
    const { mode, isDev, paths } = options;

    return {
        mode,
        entry: paths.entry,
        output: {
            filename: "[name].[contenthash].js",
            path: paths.build,
            clean: true,
            publicPath: "/",
        },
        plugins: buildPlugins(options),
        module: {
            rules: buildLoaders(options),
        },
        // TODO: add options: optimization, infrastructureLogging, cache, bail, stats, target
        resolve: buildResolvers(options),
        devtool: isDev ? "eval-cheap-module-source-map" : undefined,
        devServer: isDev ? buildDevServer(options) : undefined,
    };
};
