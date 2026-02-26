<script>
import { defineComponent, h } from "vue";
export default defineComponent({
  name: "EHtml",
  props: {
    lang: {
      type: String,
      default: "en"
    },
    dir: {
      type: String,
      default: "ltr"
    }
  },
  setup(props, { slots }) {
    return () => {
      return h(
        "html",
        {
          lang: props.lang,
          dir: props.dir
        },
        slots.default?.()
      );
    };
  }
});
</script>
