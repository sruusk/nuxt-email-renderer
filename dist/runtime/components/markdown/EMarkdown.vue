<script>
import { defineComponent, h } from "vue";
import { parseMarkdownToJSX } from "./utils";
export default defineComponent({
  name: "EMarkdown",
  props: {
    source: {
      type: String,
      default: void 0
    },
    markdownCustomStyles: {
      type: Object,
      default: void 0
    },
    markdownContainerStyles: {
      type: Object,
      default: void 0
    }
  },
  setup(props, { slots }) {
    const defaultSlot = slots.default;
    const defaultSlotText = defaultSlot?.()[0]?.children;
    const parsedMarkdown = parseMarkdownToJSX({
      markdown: defaultSlotText || props.source || "",
      customStyles: props.markdownCustomStyles
    });
    return () => {
      return h("div", {
        style: props.markdownContainerStyles,
        innerHTML: parsedMarkdown
      });
    };
  }
});
</script>
