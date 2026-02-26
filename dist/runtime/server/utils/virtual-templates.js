import { readdir, stat } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { existsSync } from "node:fs";
export async function generateTemplateMapping(emailsDir) {
  const mapping = {};
  if (!existsSync(emailsDir)) {
    console.warn(`Email templates directory not found: ${emailsDir}`);
    return mapping;
  }
  try {
    const files = await readdir(emailsDir);
    for (const file of files) {
      if (!file.endsWith(".vue")) continue;
      const filePath = join(emailsDir, file);
      const fileStats = await stat(filePath);
      if (!fileStats.isFile()) continue;
      const name = basename(file, extname(file));
      const displayName = name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z])([A-Z][a-z])/g, "$1 $2").trim();
      const importPath = `#email-templates/${name}`;
      mapping[name] = {
        name,
        filename: file,
        displayName,
        importPath,
        filePath
      };
    }
  } catch (error) {
    console.error("Error scanning email templates directory:", error);
  }
  return mapping;
}
export function generateVirtualModule(mapping) {
  const imports = [];
  const exports = [];
  const mappingEntries = [];
  const escapeString = (str) => JSON.stringify(str);
  Object.values(mapping).forEach((template, index) => {
    const importName = `Template${index}`;
    imports.push(
      `import ${importName} from ${escapeString(template.filePath)}`
    );
    exports.push(`  ${escapeString(template.name)}: ${importName}`);
    mappingEntries.push(`  ${escapeString(template.name)}: {
    name: ${escapeString(template.name)},
    filename: ${escapeString(template.filename)},
    displayName: ${escapeString(template.displayName)},
    importPath: ${escapeString(template.importPath)},
    filePath: ${escapeString(template.filePath)}
  }`);
  });
  const templatesContent = exports.length > 0 ? exports.join(",\n") : "";
  const mappingContent = mappingEntries.length > 0 ? mappingEntries.join(",\n") : "";
  return `${imports.join("\n")}

export const emailTemplates = {
${templatesContent}
}

export const emailTemplateMapping = {
${mappingContent}
}

export function getEmailTemplate(name) {
  return emailTemplates[name]
}
`;
}
