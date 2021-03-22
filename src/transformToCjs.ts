import * as babel from '@babel/types';
import * as babelCore from '@babel/core';
import { fromObject } from 'convert-source-map';

export function transformToCjs(ast: babel.File, srcFiles: Record<string, string>) {
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
    return `${result.code}\n${fromObject(result.map).toComment()}`;
}