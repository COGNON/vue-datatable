import { computed, ref, watch } from 'vue';
import useVerticalScroll from './useVerticalScroll';
import type { VRow } from '../components/types';

export default function useVirtualScroll(props: any) {
  const processedRows = computed(() => props.rows.map((r, idx) => ({ ...r, index: idx })));

  const tbodyHeight = computed(
    () => processedRows.value.length * props.rowHeight + props.expandedRowHeight
  );

  const maxVisibleCount = computed(
    () => Math.ceil(props.rootHeight / props.rowHeight) + 2 * props.virtualScrollNodePadding
  );

  const { scrollTop, onVScroll } = useVerticalScroll();

  const startNode = ref(0);
  const offsetY = computed(() => startNode.value * props.rowHeight);
  const visibleRows = ref<VRow[]>(getVisibleNodes(0));

  watch(scrollTop, () => {
    const tmpStart = Math.max(
      0,
      Math.floor(scrollTop.value / props.rowHeight) - props.virtualScrollNodePadding
    );

    // don't update if it didn't change
    if (tmpStart === startNode.value) return startNode.value;

    if (
      // scrolled back to top
      (tmpStart === 0 && startNode.value !== 0) ||
      // if the difference is over the padding
      Math.abs(startNode.value - tmpStart) > props.virtualScrollNodePadding - 2
    ) {
      startNode.value = tmpStart;
      visibleRows.value = getVisibleNodes(startNode.value);
      return tmpStart;
    }
  });

  function getVisibleNodes(start: number) {
    return processedRows.value.slice(start, start + maxVisibleCount.value);
  }

  return {
    scrollTop,
    visibleRows,
    offsetY,
    startNode,
    tbodyHeight,
    onVScroll
  };
}
