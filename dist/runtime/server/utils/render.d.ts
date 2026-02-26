import { type H3Event } from 'h3';
import type { AllowedComponentProps, Component, VNodeProps } from 'vue';
import type { Options } from './options.js';
export type RenderOptions = Options & {
    /**
     * The locale to use for rendering the email template.
     * Only applies if @nuxtjs/i18n is installed.
     */
    locale?: string;
    /**
     * The H3 event context, used to extract i18n configuration.
     * @internal
     */
    event?: H3Event;
};
export type ExtractComponentProps<TComponent> = TComponent extends new () => {
    $props: infer P;
} ? Omit<P, keyof VNodeProps | keyof AllowedComponentProps> : never;
export interface VNode {
    type: string;
    props: {
        style?: Record<string, string | number>;
        children?: string | VNode | VNode[];
        [prop: string]: unknown;
    };
}
export declare function render<T extends Component>(component: T, props?: ExtractComponentProps<T>, options?: RenderOptions): Promise<string | {
    html: string;
    subject: string;
}>;
export declare function renderEmailComponent<T extends Component>(componentName: string, props?: ExtractComponentProps<T>, options?: RenderOptions): Promise<string | {
    html: string;
    subject: string;
}>;
