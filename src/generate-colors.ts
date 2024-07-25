
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
// import * as yargs from 'yargs';
import * as fastGlob from 'fast-glob';
import * as cors from 'cors';
import * as colorthief from 'colorthief';
// import * as vibrant from 'node-vibrant';
import vibrant = require('node-vibrant');
import * as VibrantTypes from '@vibrant/types';

import { SystemPath } from './system-path';
import { FileColorsData, VibrantColorObj } from './types';
import { fetchConfig, Project } from './config';


const projects = fetchConfig();
console.log('projects', projects)

interface GetColorDataOpts {
    basePath: string;
    onFileProcessed: (file: string, progress: number) => void;
}

type FileColorData = {
    path: string,
    colorthief: {
        color: colorthief.Color,
        palette: colorthief.Color[],
    },
    vibrant: {
        vibrant: VibrantColorObj,
        muted: VibrantColorObj,
        darkVibrant: VibrantColorObj,
        darkMuted: VibrantColorObj,
        lightVibrant: VibrantColorObj,
        lightMuted: VibrantColorObj,
    },
}

async function getColorData(filePaths: string[], opts: GetColorDataOpts): Promise<FileColorsData[]> {
    const files: FileColorData[] = [];

    // const colorsListsPromises = filePaths.map(async filePath => {
    for (const filePath of filePaths) {
        console.log('processing', filePath);

        const [res_ctColor, res_ctPalette, res_vibrant] = await Promise.all([
            colorthief.getColor(filePath),
            colorthief.getPalette(filePath, 10),
            vibrant.from(filePath).getPalette(),
        ]);

        opts.onFileProcessed(filePath, filePaths.length)

        const vibrantColorObj = (swatch: VibrantColorObj | null): VibrantColorObj => {
            return {
                hex: swatch?.hex || '',
                rgb: swatch?.rgb || [0, 0, 0],
                hsl: swatch?.hsl || [0, 0, 0],
            };
        };

        // console.log(`${filePath} - ${res}`);
        // console.log(`${filePath}`);

        const relPath = filePath.replace(opts.basePath, '');

        const res = {
            path: relPath,
            colorthief: {
                color: res_ctColor,
                palette: res_ctPalette
            },
            vibrant: {
                vibrant: vibrantColorObj(res_vibrant.Vibrant),
                muted: vibrantColorObj(res_vibrant.Muted),
                darkVibrant: vibrantColorObj(res_vibrant.DarkVibrant),
                darkMuted: vibrantColorObj(res_vibrant.DarkMuted),
                lightVibrant: vibrantColorObj(res_vibrant.LightVibrant),
                lightMuted: vibrantColorObj(res_vibrant.LightMuted),
            },
        };

        files.push(res);
    }
    // });

    // const files = await Promise.all(colorsListsPromises);

    return files;
}

async function generateProjectColorsDB(project: Project, opts: {onFileProcessed: (file: string, total: number) => void}) {
    const extString = ['jpg', 'png'].map(e => ([e, e.toUpperCase()])).flat().join(',');
    const filePaths = await fastGlob(`${project.path}/**/*.{${extString}}`);
    // console.log('filePaths', filePaths)

    const colorsData = await getColorData(filePaths, {
        basePath: project.path,
        onFileProcessed: opts.onFileProcessed,
    });

    // filePaths.forEach((fp, i) => {
    //     console.log(fp, colorsLists[i]);
    // });

    await fs.promises.writeFile(project.db, JSON.stringify(colorsData));
}

;(async () => {

    const promises = projects.map((p, i) => {
        let projectFilesProcessed = 0;

        return generateProjectColorsDB(p, {
            onFileProcessed: (file, total) => {
                projectFilesProcessed += 1;

                console.log(`project ${(i + 1)}/${[projects.length]} | ${file} (${Math.round(projectFilesProcessed / total * 100)}%)`)
            },
        });
    });

    await Promise.all(promises);

})();
