import { renderToString } from "vue/server-renderer";
import { createError } from "h3";
import { createSSRApp } from "vue";
import { convert } from "html-to-text";
import { pretty } from "./pretty.js";
import { plainTextSelectors } from "./plainTextSelectors.js";
import { cleanup } from "./cleanup.js";
import { emailComponents } from "../../components/index.js";
import { SUBJECT_INJECTION_KEY } from "../../components/subject/ESubject.vue";
async function registerEmailComponents(app) {
  for (const [name, componentImporter] of Object.entries(emailComponents)) {
    const component = await componentImporter();
    app.component(name, component.default);
  }
}
async function setupI18n(app, locale, event) {
  try {
    if (event && setupI18nFromEvent) {
      const ok = await setupI18nFromEvent(app, event, locale);
      if (ok) {
        return true;
      }
    }
    return await setupI18nFromRuntimeConfig(app, locale);
  } catch (error) {
    console.warn("[nuxt-email-renderer] Failed to setup i18n:", error);
    return false;
  }
}
async function setupI18nFromEvent(app, event, locale) {
  try {
    const eventContext = event.context;
    const i18nInstance = eventContext.i18n || eventContext.$i18n;
    if (!i18nInstance) {
      return false;
    }
    const { createI18n } = await import("vue-i18n");
    const messages = i18nInstance.messages || {};
    const instanceLocale = i18nInstance.locale || i18nInstance.defaultLocale || "en";
    const i18n = createI18n({
      legacy: false,
      locale: locale || instanceLocale,
      messages,
      ...i18nInstance.options || {}
    });
    app.use(i18n);
    return true;
  } catch {
    return false;
  }
}
async function setupI18nFromRuntimeConfig(app, locale) {
  try {
    const { useRuntimeConfig } = await import("nitropack/runtime");
    const config = useRuntimeConfig();
    if (!config.public?.i18n) {
      return false;
    }
    const { createI18n } = await import("vue-i18n");
    const i18nConfig = config.public.i18n;
    const messages = i18nConfig.messages || {};
    const defaultLocale = i18nConfig.defaultLocale || i18nConfig.locale || "en";
    const i18n = createI18n({
      legacy: false,
      locale: locale || defaultLocale,
      messages,
      fallbackLocale: defaultLocale
    });
    app.use(i18n);
    return true;
  } catch {
    return false;
  }
}
export async function render(component, props, options) {
  const doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  let capturedSubject;
  const App = createSSRApp(component, props || {});
  App.provide(SUBJECT_INJECTION_KEY, (subject) => {
    capturedSubject = subject;
  });
  await registerEmailComponents(App);
  await setupI18n(App, options?.locale, options?.event);
  const markup = await renderToString(App);
  const decodedSubject = capturedSubject ? decodeHtmlEntities(capturedSubject) : void 0;
  if (options?.plainText) {
    const plainText = convert(markup, {
      selectors: plainTextSelectors,
      ...options?.plainText === true ? options.htmlToTextOptions : {}
    });
    return decodedSubject ? { html: plainText, subject: decodedSubject } : plainText;
  }
  const doc = `${doctype}${cleanup(markup)}`;
  const html = options && options.pretty ? pretty(doc) : doc;
  return decodedSubject ? { html, subject: decodedSubject } : html;
}
function decodeHtmlEntities(text) {
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'"
  };
  return text.replace(/&[a-z]+;|&#\d+;/gi, (match) => {
    return entities[match] || match;
  });
}
export async function renderEmailComponent(componentName, props, options) {
  const cleanComponentName = componentName.endsWith(".vue") ? componentName.replace(".vue", "") : componentName;
  const { getEmailTemplate, hasEmailTemplate } = await import("./template-resolver.js");
  if (!await hasEmailTemplate(cleanComponentName)) {
    throw createError({
      statusCode: 404,
      statusMessage: `Email template "${componentName}" not found`
    });
  }
  const component = await getEmailTemplate(cleanComponentName);
  if (!component) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to load email template "${componentName}"`
    });
  }
  return render(component, props, options);
}
