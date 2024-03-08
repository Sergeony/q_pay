export type BuildMode = "production" | "development";

export interface BuildPaths {
    entry: string;
    build: string;
    html: string;
    src: string;
    locales: string;
    buildLocales: string;
}

export interface BuildOptions {
    mode: BuildMode;
    isDev: boolean;
    apiUrl: string;
    port: number;
    paths: BuildPaths;
}

export interface BuildEnv {
    mode: BuildMode;
    port: number;
    apiUrl: string;
}
