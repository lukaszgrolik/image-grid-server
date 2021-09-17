declare module 'colorthief' {
    type Color = [number, number, number];

    export function getColor(path: string): Color;
    export function getPalette(path: string, quality: number): Color[];
}