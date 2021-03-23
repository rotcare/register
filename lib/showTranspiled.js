"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showTranspiled = void 0;
const project_1 = require("@rotcare/project");
const transformToCjs_1 = require("./transformToCjs");
function showTranspiled(projectDir, qualifiedName) {
    const project = new project_1.Project(projectDir);
    project.transform = transformToCjs_1.transformToCjs;
    const projectFile = project_1.buildFile(project, qualifiedName);
    console.log(projectFile.code);
}
exports.showTranspiled = showTranspiled;
