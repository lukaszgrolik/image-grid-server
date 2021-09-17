import * as path from 'path';

export class SystemPath {
    readonly dirname;
    readonly filename;
    readonly filenameFull;
    readonly extension;
    readonly normalized;

    constructor(readonly raw: string) {
        this.dirname = path.dirname(raw);

        this.filename = '';
        this.filenameFull = '';
        this.extension = '';

        this.normalized = raw.replace(/\\/g, '/');
    }
}