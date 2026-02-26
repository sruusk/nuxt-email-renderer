<script>
import { defineComponent, h } from "vue";
export default defineComponent({
  name: "EStyle",
  setup(_, { slots }) {
    return () => {
      const slotContent = slots.default?.();
      let cssText = "";
      if (slotContent && slotContent.length > 0) {
        const firstNode = slotContent[0];
        if (typeof firstNode.children === "string") {
          cssText = firstNode.children;
        } else if (Array.isArray(firstNode.children)) {
          cssText = firstNode.children.join("");
        }
      }
      return h("style", {
        "data-id": "__nuxt-email-style",
        "innerHTML": cssText
      });
    };
  }
});
</script>
