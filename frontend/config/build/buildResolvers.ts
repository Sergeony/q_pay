import webpack from "webpack";

import { BuildOptions } from "./types/config";

export const buildResolvers = (
    options: BuildOptions
): webpack.ResolveOptions => {
    const { paths } = options;

    return {
        extensions: [".tsx", ".ts", ".js"],
        preferAbsolute: true,
        modules: [paths.src, "node_modules"],
        mainFiles: ["index"],
        alias: {}
    };
};
