import * as babel from '@babel/types';
import * as babelCore from '@babel/core';

export function transformToCjs(ast: babel.File, srcFiles: Record<string, string>) {
    const result = babelCore.transformFromAstSync(ast, undefined, {
        plugins: [
            '@babel/plugin-transform-typescript',
            '@babel/plugin-transform-modules-commonjs',
        ],
    });
    if (!result || !result.code) {
        throw new Error('transform typescript failed');
    }
    return result.code;
}