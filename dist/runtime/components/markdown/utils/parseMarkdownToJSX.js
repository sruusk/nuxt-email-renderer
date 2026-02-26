import { MarkdownParser } from "./parser.js";
export const parseMarkdownToJSX = ({
  markdown,
  customStyles
}) => {
  const parser = new MarkdownParser({ customStyles });
  return parser.parse(markdown);
};
