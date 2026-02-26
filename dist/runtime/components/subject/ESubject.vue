<script>
import { computed, defineComponent, inject } from "vue";
export const SUBJECT_INJECTION_KEY = Symbol("email-subject");
export default defineComponent({
  name: "ESubject",
  setup(_, { slots }) {
    const setSubject = inject(
      SUBJECT_INJECTION_KEY,
      void 0
    );
    const text = computed(() => {
      if (slots.default !== void 0) {
        const children = slots.default()[0]?.children;
        return Array.isArray(children) ? children.join("") : children || "";
      }
      return "";
    });
    if (setSubject) {
      setSubject(text.value);
    }
    return () => null;
  }
});
</script>
