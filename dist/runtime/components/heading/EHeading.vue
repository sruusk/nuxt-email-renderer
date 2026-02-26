<script>
import { computed, defineComponent, h } from "vue";
import { withMargin } from "./EHeading.utils";
export default defineComponent({
  name: "EHeading",
  props: {
    as: {
      type: String,
      default: "h1"
    },
    m: {
      type: [String, Number],
      default: void 0
    },
    mx: {
      type: [String, Number],
      default: void 0
    },
    my: {
      type: [String, Number],
      default: void 0
    },
    mt: {
      type: [String, Number],
      default: void 0
    },
    mr: {
      type: [String, Number],
      default: void 0
    },
    mb: {
      type: [String, Number],
      default: void 0
    },
    ml: {
      type: [String, Number],
      default: void 0
    },
    style: {
      type: [Object, String],
      default: void 0
    }
  },
  setup(props, { slots }) {
    const styleObject = computed(() => {
      if (typeof props.style === "string" || Array.isArray(props.style)) {
        return {};
      }
      return props.style;
    });
    return () => {
      return h(
        props.as,
        {
          style: {
            ...withMargin({
              m: props.m,
              mx: props.mx,
              my: props.my,
              mt: props.mt,
              mr: props.mr,
              mb: props.mb,
              ml: props.ml
            }),
            ...styleObject.value
          }
        },
        slots.default?.()
      );
    };
  }
});
</script>
