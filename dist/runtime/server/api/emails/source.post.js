import { defineEventHandler, readValidatedBody, createError } from "h3";
import {
  getEmailTemplateInfo,
  hasEmailTemplate
} from "../../utils/template-resolver.js";
import { readFile } from "node:fs/promises";
import z from "zod";
const bodySchema = z.object({
  name: z.string().nonempty()
});
export default defineEventHandler(async (event) => {
  const { name: templateName } = await readValidatedBody(
    event,
    bodySchema.parse
  );
  try {
    const cleanTemplateName = templateName.endsWith(".vue") ? templateName.replace(".vue", "") : templateName;
    if (!await hasEmailTemplate(cleanTemplateName)) {
      throw createError({
        statusCode: 404,
        statusMessage: `Email template "${templateName}" not found`
      });
    }
    const templateInfo = await getEmailTemplateInfo(cleanTemplateName);
    if (!templateInfo) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to get template info for "${templateName}"`
      });
    }
    const sourceCode = await readFile(templateInfo.filePath, "utf-8");
    return {
      filename: templateInfo.filename,
      filePath: templateInfo.filePath,
      sourceCode
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    if (error.code === "ENOENT") {
      throw createError({
        statusCode: 404,
        statusMessage: `Source file not found for template "${templateName}"`
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to read source code: ${error.message || "Unknown error"}`
    });
  }
});
