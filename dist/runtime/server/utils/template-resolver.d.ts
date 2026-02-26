import type { Component } from 'vue';
import type { EmailTemplateInfo } from './virtual-templates.js';
/**
 * Get an email template component by name
 */
export declare function getEmailTemplate(templateName: string): Promise<Component | null>;
/**
 * Get template metadata by name
 */
export declare function getEmailTemplateInfo(templateName: string): Promise<EmailTemplateInfo | null>;
/**
 * Get all available email templates
 */
export declare function getAllEmailTemplates(): Promise<EmailTemplateInfo[]>;
/**
 * Check if a template exists
 */
export declare function hasEmailTemplate(templateName: string): Promise<boolean>;
