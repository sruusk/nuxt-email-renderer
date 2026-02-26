import { defineEventHandler } from "h3";
import { getAllEmailTemplates } from "../../utils/template-resolver.js";
import { consola } from "consola";
export default defineEventHandler(async () => {
  try {
    const templates = await getAllEmailTemplates();
    const mappedTemplates = templates.map((template) => ({
      name: template.name,
      filename: template.filename,
      displayName: template.displayName
    }));
    return mappedTemplates;
  } catch (error) {
    consola.error("[nuxt-email-renderer] Failed to get email templates:", error);
    return [];
  }
});
