<script>
import { defineComponent, h } from "vue";
export default defineComponent({
  name: "EFont",
  props: {
    fontFamily: {
      type: String,
      required: true
    },
    fallbackFontFamily: {
      type: [String, Array],
      default: "Arial"
    },
    webFont: {
      type: Object,
      default: void 0
    },
    fontStyle: {
      type: String,
      default: "normal"
    },
    fontWeight: {
      type: [String, Number],
      default: 400
    }
  },
  setup({ fontFamily, fallbackFontFamily, webFont, fontStyle, fontWeight }) {
    const src = webFont ? `src: url(${webFont.url}) format('${webFont.format}');` : "";
    const style = `
      @font-face {
        font-family: '${fontFamily}';
        font-style: ${fontStyle};
        font-weight: ${fontWeight};
        mso-font-alt: '${Array.isArray(fallbackFontFamily) ? fallbackFontFamily[0] : fallbackFontFamily}';
        ${src}
      }

      * {
        font-family: '${fontFamily}', ${Array.isArray(fallbackFontFamily) ? fallbackFontFamily.join(", ") : fallbackFontFamily};
      }
    `;
    return () => {
      return h("style", {
        innerHTML: style
      });
    };
  }
});
</script>
