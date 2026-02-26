import * as nuxt_schema from 'nuxt/schema';

interface ModuleOptions {
    /**
     * Folder where email templates are stored. Can be either an absolute path or relative to the project root.
     * When set, this takes priority over the auto-detected `app/emails` and `emails` directories.
     * When not set, the module auto-detects the emails directory by checking `app/emails` (Nuxt 4) then `emails`.
     */
    emailsDir?: string;
    /**
     * Enable Nuxt Devtools integration
     *
     * @default true
     */
    devtools: boolean;
}
declare const _default: nuxt_schema.NuxtModule<ModuleOptions, ModuleOptions, false>;

export { _default as default };
export type { ModuleOptions };
