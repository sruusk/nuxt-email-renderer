import type { CSSProperties } from 'vue';
type MarginCSSProperty = CSSProperties['margin' | 'marginLeft' | 'marginRight' | 'marginTop' | 'marginBottom'];
export interface Margin {
    m?: number | string;
    mx?: number | string;
    my?: number | string;
    mt?: number | string;
    mr?: number | string;
    mb?: number | string;
    ml?: number | string;
}
export declare const withMargin: (props: Margin) => {};
export declare const withSpace: (value: number | string | undefined, properties: MarginCSSProperty[]) => {};
export {};
