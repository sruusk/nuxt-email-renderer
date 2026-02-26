import { defineEventHandler, readValidatedBody, createError } from "h3";
import { renderEmailComponent } from "../../utils/render.js";
import z from "zod";
const bodySchema = z.object({
  name: z.string().nonempty(),
  pretty: z.boolean().optional(),
  plainText: z.boolean().optional(),
  props: z.custom().optional(),
  htmlToTextOptions: z.custom().optional(),
  locale: z.string().optional()
});
export default defineEventHandler(async (event) => {
  const {
    name: templateName,
    pretty,
    plainText,
    props,
    htmlToTextOptions,
    locale
  } = await readValidatedBody(event, bodySchema.parse);
  try {
    return renderEmailComponent(templateName, props, {
      pretty,
      plainText,
      htmlToTextOptions,
      locale,
      event
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to render email: ${error.message || "Unknown error"}`
    });
  }
});
