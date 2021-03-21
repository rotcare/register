import * as path from 'path';
import { buildFile, Project } from '@rotcare/project';
import { transformToCjs } from './transformToCjs';

const project = new Project('.');
project.transform = transformToCjs;

export function registerProjectFilesTranspilation() {
    let requireExtensions: NodeJS.RequireExtensions;
    try {
        requireExtensions = require.extensions;
    } catch (e) {
        console.error('Could not register extension');
        throw e;
    }

    const origJsHandler = requireExtensions['.js'];

    const registerExtension = (ext: string) => {
        const origHandler = requireExtensions[ext] || origJsHandler;
        requireExtensions[ext] = function (module, filename) {
            const qualifiedName = isProjectFile(filename);
            if (!qualifiedName) {
                return origHandler(module, filename);
            }
            const projectFile = buildFile(project, qualifiedName)
            return (module as any)._compile(projectFile.code, filename);
        };
    };

    registerExtension('.ts');
    registerExtension('.tsx');
}

function isProjectFile(filename: string) {
    const relPath = path.relative(project.projectDir, filename);
    if (relPath[0] === '.') {
        return undefined;
    }
    const dotPos = relPath.indexOf('.');
    const qualifiedName = relPath.substr(0, dotPos);
    return qualifiedName;
}