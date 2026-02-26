import { defineNitroPlugin, useRuntimeConfig } from "nitropack/runtime";
export default defineNitroPlugin(async () => {
  try {
    const config = useRuntimeConfig();
    const i18nConfig = config.public?.i18n;
    if (!i18nConfig || !i18nConfig.vueI18n) {
      return;
    }
    if (typeof i18nConfig.vueI18n === "string") {
      try {
        const vueI18nModule = await import(
          /* @vite-ignore */
          i18nConfig.vueI18n
        ).catch(() => null);
        if (vueI18nModule) {
          const vueI18nConfig = typeof vueI18nModule.default === "function" ? vueI18nModule.default() : vueI18nModule.default;
          if (vueI18nConfig?.messages) {
            i18nConfig.messages = vueI18nConfig.messages;
            i18nConfig.vueI18n = {
              ...vueI18nConfig,
              messages: vueI18nConfig.messages
            };
          }
        }
      } catch (error) {
        console.warn(
          "[nuxt-email-renderer] Failed to load i18n messages:",
          error
        );
      }
    }
  } catch {
  }
});
