import type { PropType } from 'vue';
type FallbackFont = 'Arial' | 'Helvetica' | 'Verdana' | 'Georgia' | 'Times New Roman' | 'serif' | 'sans-serif' | 'monospace' | 'cursive' | 'fantasy';
type FontFormat = 'woff' | 'woff2' | 'truetype' | 'opentype' | 'embedded-opentype' | 'svg';
type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | number;
type FontStyle = 'normal' | 'italic' | 'oblique';
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    fontFamily: {
        type: StringConstructor;
        required: true;
    };
    fallbackFontFamily: {
        type: PropType<FallbackFont | FallbackFont[]>;
        default: string;
    };
    webFont: {
        type: PropType<{
            url: string;
            format: FontFormat;
        }>;
        default: undefined;
    };
    fontStyle: {
        type: PropType<FontStyle>;
        default: string;
    };
    fontWeight: {
        type: PropType<FontWeight>;
        default: number;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    fontFamily: {
        type: StringConstructor;
        required: true;
    };
    fallbackFontFamily: {
        type: PropType<FallbackFont | FallbackFont[]>;
        default: string;
    };
    webFont: {
        type: PropType<{
            url: string;
            format: FontFormat;
        }>;
        default: undefined;
    };
    fontStyle: {
        type: PropType<FontStyle>;
        default: string;
    };
    fontWeight: {
        type: PropType<FontWeight>;
        default: number;
    };
}>> & Readonly<{}>, {
    fontStyle: FontStyle;
    fontWeight: FontWeight;
    fallbackFontFamily: FallbackFont | FallbackFont[];
    webFont: {
        url: string;
        format: FontFormat;
    };
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
