export type RgbTuple = [number, number, number];
export type VibrantColorObj = {
    hex: string;
    rgb: RgbTuple;
    hsl: RgbTuple;
}

export type FileColorsData = {
    path: string;
    colorthief: {
        color: RgbTuple,
        palette: RgbTuple[]
    };
    vibrant: {
        vibrant: VibrantColorObj;
        muted: VibrantColorObj;
        darkVibrant: VibrantColorObj;
        darkMuted: VibrantColorObj;
        lightVibrant: VibrantColorObj;
        lightMuted: VibrantColorObj;
    };
};