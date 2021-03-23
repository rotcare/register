import * as path from 'path';
import { buildFile, Project } from '@rotcare/project';
import * as sourceMapSupport from 'source-map-support';
import * as babelCore from '@babel/core';

const project = new Project('.');

export function registerProjectFilesTranspilation() {
    patchResolveFilename();
    registerExtensions();
    installSourceMapSupport();
}

function patchResolveFilename() {
    const builtinModule = require('module');
    const Module = module.constructor.length > 1 ? module.constructor : builtinModule;
    const oldResolveFilename = Module._resolveFilename;
    Module._resolveFilename = function (
        request: any,
        parentModule: any,
        isMain: any,
        options: any,
    ) {
        if (request.startsWith('@motherboard/')) {
            return `${request}.ts`;
        }
        return oldResolveFilename.call(this, request, parentModule, isMain, options);
    };
}

function registerExtensions() {
    let requireExtensions: NodeJS.RequireExtensions;
    try {
        requireExtensions = require.extensions;
    } catch (e) {
        console.error('Could not register extension');
        throw e;
    }

    const registerExtension = (ext: string) => {
        requireExtensions[ext] = function (module, filename) {
            const qualifiedName = isProjectFile(filename);
            if (!qualifiedName) {
                const jsCode = translateTs(filename);
                return (module as any)._compile(jsCode, filename);
            }
            const jsCode = buildFile(project, qualifiedName)
            return (module as any)._compile(jsCode, filename);
        };
    };

    registerExtension('.ts');
    registerExtension('.tsx');
}

function installSourceMapSupport() {
    sourceMapSupport.install({ retrieveFile: (path) => {
        if (!path.endsWith('.ts') && !path.endsWith('.tsx')) {
            return undefined as any;
        }
        const qualifiedName = isProjectFile(path);
        if (qualifiedName) {
            return buildFile(project, qualifiedName);
        }
        return translateTs(path);
    }, environment: 'node', handleUncaughtExceptions: false })
}

function translateTs(filename: string) {
    const result = babelCore.transformFileSync(filename, {
        sourceMaps: 'inline',
        plugins: ["@babel/plugin-transform-typescript", "@babel/plugin-transform-modules-commonjs"],
    });
    if (!result || !result.code) {
        throw new Error('transform typescript failed');
    }
    return result.code;
}

function isProjectFile(filename: string) {
    if (filename.startsWith('@motherboard/')) {
        const qualifiedName = filename.replace('.ts', '').substr('@motherboard/'.length);
        return qualifiedName;
    }
    const relPath = path.relative(project.projectDir, filename);
    if (relPath[0] === '.') {
        return undefined;
    }
    const dotPos = relPath.indexOf('.');
    const qualifiedName = relPath.substr(0, dotPos);
    return qualifiedName;
}