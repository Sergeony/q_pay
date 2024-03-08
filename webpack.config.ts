import path from "path";

import { BuildEnv } from "./config/build/types/config";
import { buildWebpackConfig } from "./config/build/buildWebpackConfig";

export default (env: BuildEnv) => {
    const mode = env.mode || "development";
    const isDev = mode === "development";
    const apiUrl = env.apiUrl || "http://localhost:8000";
    const port = env.port || 3000;
    const paths = {
        entry: path.resolve(__dirname, "src", "index.tsx"),
        build: path.resolve(__dirname, "build"),
        html: path.resolve(__dirname, "public", "index.html"),
        src: path.resolve(__dirname, "src"),
        locales: path.resolve(__dirname, "public", "locales"),
        buildLocales: path.resolve(__dirname, "build", "locales"),
    };

    return buildWebpackConfig({
        mode,
        isDev,
        apiUrl,
        port,
        paths,
    });
};
