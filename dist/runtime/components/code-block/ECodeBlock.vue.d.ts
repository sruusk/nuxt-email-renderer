import type { PropType } from 'vue';
import type { BundledLanguage, BundledTheme, SpecialLanguage, ThemeRegistrationAny } from 'shiki';
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    code: {
        type: StringConstructor;
        required: true;
    };
    lang: {
        type: PropType<BundledLanguage | SpecialLanguage>;
        required: true;
    };
    theme: {
        type: PropType<BundledTheme | ThemeRegistrationAny>;
        required: true;
    };
    class: {
        type: StringConstructor;
        default: string;
    };
    showLineNumbers: {
        type: BooleanConstructor;
        default: boolean;
    };
    lineNumberColor: {
        type: StringConstructor;
        default: string;
    };
    lineHighlightingColor: {
        type: StringConstructor;
        default: string;
    };
    highlightedLines: {
        type: PropType<number[]>;
        default: () => never[];
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    code: {
        type: StringConstructor;
        required: true;
    };
    lang: {
        type: PropType<BundledLanguage | SpecialLanguage>;
        required: true;
    };
    theme: {
        type: PropType<BundledTheme | ThemeRegistrationAny>;
        required: true;
    };
    class: {
        type: StringConstructor;
        default: string;
    };
    showLineNumbers: {
        type: BooleanConstructor;
        default: boolean;
    };
    lineNumberColor: {
        type: StringConstructor;
        default: string;
    };
    lineHighlightingColor: {
        type: StringConstructor;
        default: string;
    };
    highlightedLines: {
        type: PropType<number[]>;
        default: () => never[];
    };
}>> & Readonly<{}>, {
    class: string;
    showLineNumbers: boolean;
    lineNumberColor: string;
    lineHighlightingColor: string;
    highlightedLines: number[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
