
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
// import * as yargs from 'yargs';
import * as fastGlob from 'fast-glob';
import * as cors from 'cors';
import * as colorthief from 'colorthief';
// import * as vibrant from 'node-vibrant';
import vibrant = require('node-vibrant');

import { SystemPath } from './system-path';

const imagesFolder = new SystemPath(`C:\\Users\\lukasz\\Desktop\\colorthief-test`);

const data: {path: string; palette: ([number, number, number] | undefined)[]}[] = [];

; (async () => {

    const extString = ['jpg', 'png'].map(e => ([e, e.toUpperCase()])).flat().join(',');
    const filePaths = await fastGlob(`${imagesFolder.normalized}/**/*.{${extString}}`);
    console.log('filePaths', filePaths)

    const colorsListsPromises = filePaths.map(async filePath => {
        // const res = await colorthief.getColor(filePath);
        // const res = await colorthief.getPalette(filePath, 10);
        const res = await vibrant.from(filePath).getPalette();

        // console.log(`${filePath} - ${res}`);
        console.log(`${filePath}`);
        data.push({
            path: filePath,
            palette: [
                res.Vibrant?.rgb,
                res.Muted?.rgb,
                res.DarkVibrant?.rgb,
                res.DarkMuted?.rgb,
                res.LightVibrant?.rgb,
                res.LightMuted?.rgb,
            ],
        })

        return res;
    });
    const colorsLists = await Promise.all(colorsListsPromises);

    // filePaths.forEach((fp, i) => {
    //     console.log(fp, colorsLists[i]);
    // });

    fs.writeFileSync(path.resolve(process.cwd(), 'vibrant.json'), JSON.stringify(data));

})();
