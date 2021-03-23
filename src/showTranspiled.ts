import { buildFile, Project } from '@rotcare/project';

export function showTranspiled(projectDir: string, qualifiedName: string) {
    const project = new Project(projectDir);
    const jsCode = buildFile(project, qualifiedName);
    console.log(jsCode);
}
