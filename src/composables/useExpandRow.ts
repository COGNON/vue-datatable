import { computed, ref } from 'vue';

export default function useExpandRow() {
  const expandRef = ref<HTMLElement | undefined>();
  const expandedHeight = computed(() => expandRef.value?.clientHeight || 0);
  const expanded = ref(false);
  const expandIcon = computed(() => (expanded.value ? 'mdi-minus' : 'mdi-plus'));

  const expandRow = () => (expanded.value = !expanded.value);

  return { expandRef, expandedHeight, expanded, expandIcon, expandRow };
}
