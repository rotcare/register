"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProjectFilesTranspilation = void 0;
const path = require("path");
const project_1 = require("@rotcare/project");
const transformToCjs_1 = require("./transformToCjs");
const sourceMapSupport = require("source-map-support");
const babelCore = require("@babel/core");
const project = new project_1.Project('.');
project.transform = transformToCjs_1.transformToCjs;
function registerProjectFilesTranspilation() {
    patchResolveFilename();
    registerExtensions();
    installSourceMapSupport();
}
exports.registerProjectFilesTranspilation = registerProjectFilesTranspilation;
function patchResolveFilename() {
    const builtinModule = require('module');
    const Module = module.constructor.length > 1 ? module.constructor : builtinModule;
    const oldResolveFilename = Module._resolveFilename;
    Module._resolveFilename = function (request, parentModule, isMain, options) {
        if (request.startsWith('@motherboard/')) {
            return `${request}.ts`;
        }
        return oldResolveFilename.call(this, request, parentModule, isMain, options);
    };
}
function registerExtensions() {
    let requireExtensions;
    try {
        requireExtensions = require.extensions;
    }
    catch (e) {
        console.error('Could not register extension');
        throw e;
    }
    const registerExtension = (ext) => {
        requireExtensions[ext] = function (module, filename) {
            const qualifiedName = isProjectFile(filename);
            if (!qualifiedName) {
                const code = translateTs(filename);
                return module._compile(code, filename);
            }
            const projectFile = project_1.buildFile(project, qualifiedName);
            return module._compile(projectFile.code, filename);
        };
    };
    registerExtension('.ts');
    registerExtension('.tsx');
}
function installSourceMapSupport() {
    sourceMapSupport.install({ retrieveFile: (path) => {
            if (!path.endsWith('.ts') && !path.endsWith('.tsx')) {
                return undefined;
            }
            const qualifiedName = isProjectFile(path);
            if (qualifiedName) {
                return project_1.buildFile(project, qualifiedName).code;
            }
            return translateTs(path);
        }, environment: 'node', handleUncaughtExceptions: false });
}
function translateTs(filename) {
    const result = babelCore.transformFileSync(filename, {
        sourceMaps: 'inline',
        plugins: ["@babel/plugin-transform-typescript", "@babel/plugin-transform-modules-commonjs"],
    });
    if (!result || !result.code) {
        throw new Error('transform typescript failed');
    }
    return result.code;
}
function isProjectFile(filename) {
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
