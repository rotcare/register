import * as path from 'path';
import { buildModels, Project } from '@rotcare/project';
import { transformToCjs } from './transformToCjs';

export function registerProjectFilesTranspilation() {
    const project = new Project('.');
    project.transform = transformToCjs;
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
            const relPath = path.relative(project.projectDir, filename);
            if (relPath[0] === '.') {
                return origHandler(module, filename);
            }
            const dotPos = relPath.indexOf('.');
            const qualifiedName = relPath.substr(0, dotPos);
            project.toBuild.add(qualifiedName);
            buildModels({ project })
            return (module as any)._compile(project.models.get(qualifiedName)?.code, filename);
        };
    };

    registerExtension('.ts');
    registerExtension('.tsx');
}
