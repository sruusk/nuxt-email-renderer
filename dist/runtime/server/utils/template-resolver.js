let emailTemplates = {};
let emailTemplateMapping = {};
let initialized = false;
let initPromise = null;
async function initializeTemplates() {
  if (initPromise) {
    return initPromise;
  }
  initPromise = (async () => {
    try {
      const virtualModule = await import("#email-templates");
      emailTemplates = virtualModule.emailTemplates || {};
      emailTemplateMapping = virtualModule.emailTemplateMapping || {};
      initialized = true;
    } catch (error) {
      console.warn(
        "[nuxt-email-renderer] Virtual email templates module not available",
        error
      );
      if (!initialized) {
        emailTemplates = {};
        emailTemplateMapping = {};
      }
    } finally {
      initPromise = null;
    }
  })();
  return initPromise;
}
async function ensureInitialized() {
  if (!initialized) {
    await initializeTemplates();
  }
}
export async function getEmailTemplate(templateName) {
  await ensureInitialized();
  const template = emailTemplates[templateName];
  if (!template) {
    console.warn(`[nuxt-email-renderer] Template "${templateName}" not found`);
    return null;
  }
  return template;
}
export async function getEmailTemplateInfo(templateName) {
  await ensureInitialized();
  return emailTemplateMapping[templateName] || null;
}
export async function getAllEmailTemplates() {
  await ensureInitialized();
  return Object.values(emailTemplateMapping);
}
export async function hasEmailTemplate(templateName) {
  await ensureInitialized();
  return templateName in emailTemplates;
}
