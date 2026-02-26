import { marked } from "marked";
import { initRenderer } from "./utils.js";
export class MarkdownParser {
  renderer;
  constructor({ customStyles }) {
    this.renderer = initRenderer({ customStyles });
  }
  parse(markdown) {
    return marked.parse(markdown, { renderer: this.renderer });
  }
}
