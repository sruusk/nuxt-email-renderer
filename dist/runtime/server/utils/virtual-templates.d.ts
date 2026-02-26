import type { EmailTemplate, EmailTemplateInfo, EmailTemplateMapping } from '../../types/index.js';
export type { EmailTemplate, EmailTemplateInfo, EmailTemplateMapping };
/**
 * Scans the emails directory and generates template mappings
 */
export declare function generateTemplateMapping(emailsDir: string): Promise<EmailTemplateMapping>;
/**
 * Generates virtual module content for email templates
 */
export declare function generateVirtualModule(mapping: EmailTemplateMapping): string;
