import { resolve, join, basename, dirname } from 'node:path';
import { defineNuxtModule, createResolver, logger, addServerImports, addServerHandler, addTypeTemplate } from '@nuxt/kit';
import { existsSync } from 'node:fs';
import vue from '@vitejs/plugin-vue';
import { generateTemplateMapping, generateVirtualModule } from '../dist/runtime/server/utils/virtual-templates.js';

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();

const DEVTOOLS_UI_ROUTE = "/__nuxt-email-renderer";
const DEVTOOLS_UI_LOCAL_PORT = 3300;
function setupDevToolsUI(nuxt, resolver) {
  const clientPath = resolver.resolve("./client");
  const isProductionBuild = existsSync(clientPath);
  if (isProductionBuild) {
    nuxt.hook("vite:serverCreated", async (server) => {
      const sirv = await import('./chunks/build.mjs').then((r) => r.default || r);
      server.middlewares.use(
        DEVTOOLS_UI_ROUTE,
        sirv(clientPath, { dev: true, single: true })
      );
    });
  } else {
    nuxt.hook("vite:extendConfig", (config) => {
      config.server = config.server || {};
      config.server.proxy = config.server.proxy || {};
      config.server.proxy[DEVTOOLS_UI_ROUTE] = {
        target: "http://localhost:" + DEVTOOLS_UI_LOCAL_PORT + DEVTOOLS_UI_ROUTE,
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(DEVTOOLS_UI_ROUTE, "")
      };
    });
  }
  nuxt.hook("devtools:customTabs", (tabs) => {
    tabs.push({
      // unique identifier
      name: "nuxt-email-renderer",
      // title to display in the tab
      title: "Nuxt Email Renderer",
      // any icon from Iconify, or a URL to an image
      icon: "twemoji:incoming-envelope",
      // iframe view
      view: {
        type: "iframe",
        src: DEVTOOLS_UI_ROUTE
      }
    });
  });
}

const LOGGER_PREFIX = "Nuxt Email Renderer:";
const module = defineNuxtModule({
  meta: {
    name: "nuxt-email-renderer",
    configKey: "nuxtEmailRenderer"
  },
  // Default configuration options of the Nuxt module
  defaults() {
    return {
      devtools: true
    };
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const { resolve: resolve$1 } = createResolver(import.meta.url);
    nuxt.options.nitro ||= {};
    nuxt.options.nitro.esbuild = nuxt.options.nitro.esbuild || {};
    nuxt.options.nitro.esbuild.options = nuxt.options.nitro.esbuild.options || {};
    nuxt.options.nitro.esbuild.options.target = nuxt.options.nitro.esbuild.options.target || "es2020";
    nuxt.options.runtimeConfig.public.nuxtEmailRenderer = defu(
      nuxt.options.runtimeConfig.public.nuxtEmailRenderer,
      options
    );
    nuxt.hook("nitro:config", async () => {
      const hasI18n = nuxt.options.modules.some((m) => {
        if (typeof m === "string") {
          return m.includes("@nuxtjs/i18n");
        }
        if (Array.isArray(m)) {
          const first = m[0];
          return typeof first === "string" && first.includes("@nuxtjs/i18n");
        }
        return false;
      });
      if (hasI18n && nuxt.options.i18n) {
        const i18nOptions = nuxt.options.i18n;
        const publicI18n = nuxt.options.runtimeConfig.public.i18n || {};
        let messages = {};
        if (i18nOptions.vueI18n && typeof i18nOptions.vueI18n === "string") {
          try {
            const configPath = resolve$1(
              nuxt.options.rootDir,
              i18nOptions.vueI18n
            );
            const { pathToFileURL } = await import('node:url');
            const configModule = await import(pathToFileURL(configPath).href);
            const configResult = typeof configModule.default === "function" ? configModule.default() : configModule.default;
            if (configResult && configResult.messages) {
              messages = configResult.messages;
              logger.success(
                `${LOGGER_PREFIX} Loaded i18n messages for ${Object.keys(messages).length} locale(s)`
              );
            }
          } catch (error) {
            logger.warn(
              `${LOGGER_PREFIX} Could not load i18n messages from config file: ${error}`
            );
          }
        } else if (i18nOptions.vueI18n && typeof i18nOptions.vueI18n === "object") {
          messages = i18nOptions.vueI18n.messages || {};
        }
        nuxt.options.runtimeConfig.public.i18n = defu(publicI18n, {
          defaultLocale: i18nOptions.defaultLocale || i18nOptions.locale || "en",
          locales: i18nOptions.locales || [],
          messages,
          vueI18n: typeof i18nOptions.vueI18n === "object" ? i18nOptions.vueI18n : {}
        });
        logger.info(
          `${LOGGER_PREFIX} i18n support enabled with default locale: ${i18nOptions.defaultLocale || i18nOptions.locale || "en"}`
        );
      }
    });
    const templatesDirs = [];
    for (const layer of nuxt.options._layers) {
      if (options.emailsDir) {
        const customEmailsPath = resolve(layer.cwd, options.emailsDir);
        if (existsSync(customEmailsPath)) {
          templatesDirs.push(customEmailsPath);
          continue;
        }
        if (layer.cwd === nuxt.options.rootDir) {
          logger.warn(`${LOGGER_PREFIX} Configured emailsDir '${options.emailsDir}' not found at '${customEmailsPath}', falling back to auto-detection.`);
        }
      }
      const appEmailsPath = join(layer.cwd, "app", "emails");
      if (existsSync(appEmailsPath)) {
        templatesDirs.push(appEmailsPath);
        continue;
      }
      const rootEmailsPath = join(layer.cwd, "emails");
      if (existsSync(rootEmailsPath)) {
        templatesDirs.push(rootEmailsPath);
      }
    }
    if (templatesDirs.length === 0) {
      logger.warn(`${LOGGER_PREFIX} No email templates directory found. Configure emailsDir or create an 'emails' or 'app/emails' directory.`);
    }
    const templatesDir = templatesDirs[0];
    nuxt.options.runtimeConfig.public.nuxtEmailRenderer.emailsDir = templatesDir;
    nuxt.options.nitro.alias = nuxt.options.nitro.alias || {};
    nuxt.options.nitro.externals = defu(
      typeof nuxt.options.nitro.externals === "object" ? nuxt.options.nitro.externals : {},
      {
        inline: [resolve$1("./runtime")]
      }
    );
    addServerImports([
      {
        name: "renderEmailComponent",
        from: resolver.resolve("runtime/server/utils/render")
      }
    ]);
    nuxt.hooks.hook("nitro:config", async (nitroConfig) => {
      try {
        const templateMapping = {};
        for (const dir of [...templatesDirs].reverse()) {
          const dirMapping = await generateTemplateMapping(dir);
          Object.assign(templateMapping, dirMapping);
        }
        const virtualModuleContent = generateVirtualModule(templateMapping);
        nitroConfig.virtual = nitroConfig.virtual || {};
        nitroConfig.virtual["#email-templates"] = virtualModuleContent;
        nitroConfig.alias = nitroConfig.alias || {};
        nitroConfig.alias["#email-templates"] = "virtual:#email-templates";
        nitroConfig.rollupConfig = nitroConfig.rollupConfig || {};
        nitroConfig.rollupConfig.plugins = nitroConfig.rollupConfig.plugins || [];
        nitroConfig.rollupConfig.external = nitroConfig.rollupConfig.external || [];
        if (Array.isArray(nitroConfig.rollupConfig.external)) {
          nitroConfig.rollupConfig.external.push("vue-i18n");
        }
        const vuePlugin = vue({
          include: "**/*.vue",
          // Only .vue files, nothing else
          isProduction: !nuxt.options.dev,
          script: {
            defineModel: true,
            propsDestructure: true
          },
          template: {
            compilerOptions: {
              // Preserve whitespace for email client compatibility
              whitespace: "preserve"
            }
          }
        });
        if (Array.isArray(nitroConfig.rollupConfig.plugins)) {
          nitroConfig.rollupConfig.plugins.unshift(vuePlugin);
        } else {
          nitroConfig.rollupConfig.plugins = [vuePlugin];
        }
        logger.success(
          `${LOGGER_PREFIX} Generated virtual module with ${Object.keys(templateMapping).length} email template(s)`
        );
      } catch (error) {
        logger.error(
          `${LOGGER_PREFIX} Failed to generate virtual module`,
          error
        );
      }
    });
    if (nuxt.options.dev) {
      nuxt.options.watch = nuxt.options.watch || [];
      for (const dir of templatesDirs) {
        nuxt.options.watch.push(`${dir}/**/*.vue`);
      }
      nuxt.hooks.hook("builder:watch", async (event, path) => {
        if (templatesDirs.some((dir) => path.startsWith(dir)) && path.endsWith(".vue")) {
          logger.info(`${LOGGER_PREFIX} Template ${event} - ${path}`);
          logger.info(`${LOGGER_PREFIX} Server will restart to apply changes`);
        }
      });
      nuxt.hooks.hook("nitro:config", (nitroConfig) => {
        nitroConfig.devStorage = nitroConfig.devStorage || {};
        nitroConfig.devStorage["emails"] = {
          driver: "fs",
          base: templatesDir
        };
      });
    }
    nuxt.options.nitro.serverAssets = nuxt.options.nitro.serverAssets || [];
    for (const [index, dir] of templatesDirs.entries()) {
      const layerName = basename(dirname(dir));
      nuxt.options.nitro.serverAssets.push({
        baseName: index === 0 ? "emails" : `emails_${layerName}_${index}`,
        dir
      });
    }
    if (nuxt.options.dev) {
      logger.info(`${LOGGER_PREFIX} Registering dev-only API endpoints`);
      addServerHandler({
        route: "/api/emails/render",
        handler: resolve$1("./runtime/server/api/emails/render.post")
      });
      addServerHandler({
        route: "/api/emails/source",
        handler: resolve$1("./runtime/server/api/emails/source.post")
      });
      addServerHandler({
        route: "/api/emails",
        handler: resolve$1("./runtime/server/api/emails/index.get")
      });
    }
    addTypeTemplate({
      filename: "types/nuxt-email-renderer-components.d.ts",
      getContents: async () => {
        const { emailComponents } = await import('../dist/runtime/components/index.js');
        const componentNames = Object.keys(emailComponents);
        const generateComponentTypes = (names) => {
          return names.map((name) => {
            return `    ${name}: import('vue').DefineComponent<{}, {}, any>`;
          }).join("\n");
        };
        const componentTypes = generateComponentTypes(componentNames);
        return `
// Auto-generated email component types for nuxt-email-renderer
// This file is automatically generated based on the components in emailComponents.
// Do not edit this file manually - it will be regenerated on every build.
// To add new components, add them to src/runtime/components/index.ts
//
// Note: These components use generic Vue component types to prevent bundling
// server-only dependencies (shiki, marked) into the client bundle.
// Email components are only used server-side for email rendering.
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
${componentTypes}
  }
}

declare module 'vue' {
  export interface GlobalComponents {
${componentTypes}
  }
}

export {}
`;
      }
    });
    if (options.devtools) setupDevToolsUI(nuxt, resolver);
  }
});

export { module as default };
