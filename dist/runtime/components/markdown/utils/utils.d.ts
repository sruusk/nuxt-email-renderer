import type { CSSProperties } from 'vue';
import type { initRendererProps } from './types.js';
import { Renderer } from 'marked';
export declare function camelToKebabCase(str: string): string;
export declare function parseCssInJsToInlineCss(cssProperties: CSSProperties | undefined): string;
export declare const initRenderer: ({ customStyles, }: initRendererProps) => Renderer;
