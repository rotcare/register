import { buildFile, Project } from '@rotcare/project';
import { transformToCjs } from './transformToCjs';

export function showTranspiled(projectDir: string, qualifiedName: string) {
    const project = new Project(projectDir);
    project.transform = transformToCjs;
    const projectFile = buildFile(project, qualifiedName);
    console.log(projectFile.code);
}
