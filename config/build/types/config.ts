export type BuildMode = "production" | "development";


export interface BuildPaths {
    entry: string;
    build: string;
    html: string;
    src: string;
}


export interface BuildOptions {
    mode: BuildMode;
    isDev: boolean;
    port: number;
    paths: BuildPaths;
}


export interface BuildEnv {
    mode: BuildMode;
    port: number;
}
