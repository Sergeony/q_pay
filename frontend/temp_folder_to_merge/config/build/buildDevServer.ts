import type { Configuration } from "webpack-dev-server";

import { BuildOptions } from "./types/config";

export const buildDevServer = (options: BuildOptions): Configuration => {
    const { port } = options;

    return {
        port,
        historyApiFallback: true,
        hot: true,
        client: {
            overlay: false,
        },
    };
};
