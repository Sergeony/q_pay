import path from "path";
import webpack from "webpack";
import { BuildPaths } from "../build/types/config";
import { buildCssLoader } from "../build/loaders/buildCssLoader";

export default ({ config }: {config: webpack.Configuration}) => {
    const paths: BuildPaths = {
        entry: "",
        build: "",
        html: "",
        src: path.resolve(__dirname, "..", "..", "src"),
    };
    config.resolve.modules.push(paths.src);
    config.resolve.extensions.push(".ts", ".tsx");

    // eslint-disable-next-line no-param-reassign
    config.module.rules = config.module.rules.map((rule: webpack.RuleSetRule) => {
        if (/svg/.test(rule.test as string)) {
            return { ...rule, exclude: /svg/ };
        }
        return rule;
    });
    config.module.rules.push({
        test: /\.svg$/,
        use: "@svgr/webpack",
    });
    config.module.rules.push(buildCssLoader(true));

    config.plugins.push(
        new webpack.DefinePlugin({
            __IS_DEV__: JSON.stringify(true),
            __API_URL__: JSON.stringify(""),
        })
    );

    return config;
};