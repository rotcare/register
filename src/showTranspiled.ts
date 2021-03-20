import { buildModels, Project } from '@rotcare/project';
import { transformToCjs } from './transformToCjs';

export function showTranspiled(projectDir: string, qualifiedName: string) {
    const project = new Project(projectDir);
    project.transform = transformToCjs;
    project.toBuild.add(qualifiedName);
    buildModels({ project });
    console.log(project.models.get(qualifiedName)?.code);
}
