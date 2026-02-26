import type { StylesType } from './types.js';
export declare class MarkdownParser {
    private readonly renderer;
    constructor({ customStyles }: {
        customStyles?: StylesType;
    });
    parse(markdown: string): string;
}
