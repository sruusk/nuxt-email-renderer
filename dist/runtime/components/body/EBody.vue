<script>
import { defineComponent, h } from "vue";
export default defineComponent({
  name: "EBody",
  props: {
    style: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { slots, attrs }) {
    return () => {
      const { style = {} } = props;
      const bodyStyle = {
        background: style.background,
        backgroundColor: style.backgroundColor
      };
      const tableNode = h("table", {
        border: 0,
        width: "100%",
        cellpadding: "0",
        cellspacing: "0",
        role: "presentation",
        align: "center"
      }, [
        h("tbody", [
          h("tr", [
            // Yahoo and AOL remove all styles of the body element while converting it to a div,
            // so we need to apply them to an inner cell.
            // See https://github.com/resend/react-email/issues/662.
            h("td", { style }, slots.default?.())
          ])
        ])
      ]);
      return h("body", {
        ...attrs,
        style: bodyStyle
      }, [tableNode]);
    };
  }
});
</script>
