"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformToCjs = void 0;
const babelCore = require("@babel/core");
const convert_source_map_1 = require("convert-source-map");
function transformToCjs(ast, srcFiles) {
    const result = babelCore.transformFromAstSync(ast, undefined, {
        sourceMaps: true,
        plugins: [
            '@babel/plugin-transform-typescript',
            '@babel/plugin-transform-modules-commonjs',
        ],
    });
    if (!result || !result.code || !result.map) {
        throw new Error('transform typescript failed');
    }
    result.map.sourcesContent = [];
    result.map.sourcesContent.length = result.map.sources.length;
    for (const [i, srcFilePath] of result.map.sources.entries()) {
        result.map.sourcesContent[i] = srcFiles[srcFilePath];
    }
    return `${result.code}\n${convert_source_map_1.fromObject(result.map).toComment()}`;
}
exports.transformToCjs = transformToCjs;
