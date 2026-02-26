<script>
import { defineComponent, h, ref } from "vue";
export default defineComponent({
  name: "EImg",
  props: {
    src: {
      type: String,
      required: true
    },
    width: {
      type: [String, Number],
      required: false
    },
    height: {
      type: [String, Number],
      required: false
    },
    alt: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const src = ref(props.src);
    return () => {
      return h("img", {
        style: "display: block; outline: none; border: none; text-decoration: none",
        src: src.value,
        width: props.width,
        height: props.height,
        alt: props.alt
      });
    };
  }
});
</script>
