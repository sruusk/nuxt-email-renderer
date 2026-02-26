import { type CSSProperties, type PropType } from 'vue';
import type { StylesType } from './utils/index.js';
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    source: {
        type: StringConstructor;
        default: undefined;
    };
    markdownCustomStyles: {
        type: PropType<StylesType>;
        default: undefined;
    };
    markdownContainerStyles: {
        type: PropType<CSSProperties>;
        default: undefined;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    source: {
        type: StringConstructor;
        default: undefined;
    };
    markdownCustomStyles: {
        type: PropType<StylesType>;
        default: undefined;
    };
    markdownContainerStyles: {
        type: PropType<CSSProperties>;
        default: undefined;
    };
}>> & Readonly<{}>, {
    source: string;
    markdownCustomStyles: StylesType;
    markdownContainerStyles: CSSProperties;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
