
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
// import * as yargs from 'yargs';
import * as fastGlob from 'fast-glob';
import * as cors from 'cors';
import * as colorthief from 'colorthief';

import { SystemPath } from './system-path';
import { fetchConfig } from './config';

const projects = fetchConfig();

const PORT = 3110;

const app = express();

app.use(cors());

projects.forEach(p => {
    app.use(`/assets/${p.name}`, express.static(p.path));
});

app.get('/', async (req, res) => {
    // res.send(html());
});

app.get('/projects', async (req, res) => {
    res.json(projects.map(p => p.name));
});

app.get('/projects/:projectName/images', async (req, res, next) => {
    try {

        const {projectName} = req.params;

        const project = projects.find(p => p.name === projectName);
        if (!project) throw new Error(`project not found: ${projectName}`);

        const dbStr = await fs.promises.readFile(project.db, 'utf-8');

        res.json(JSON.parse(dbStr));
    }
    catch (err) {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});