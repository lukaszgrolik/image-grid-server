import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'yaml';

export interface Project {
    name: string;
    path: string;
    db: string;
}

export function fetchConfig() {
    const configStr = fs.readFileSync(path.resolve(__dirname, '../config.yaml'), 'utf8');
    const config = yaml.parse(configStr);
    const projects = Object.keys(config.projects).map(projectName => {
        const p = config.projects[projectName];

        return {
            name: projectName,
            path: p.path,
            db: p.db,
        }
    }) as Project[];

    return projects;
};