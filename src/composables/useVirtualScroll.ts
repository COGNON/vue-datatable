import { computed } from 'vue';
import useVerticalScroll from './useVerticalScroll';
import { VRow } from 'src/components/types';

export default function useVirtualScroll(props: any) {
  const tbodyHeight = computed(() => props.rows.length * props.rowHeight + props.expandedRowHeight);
  const maxVisibleCount = computed(
    () => Math.ceil(props.rootHeight / props.rowHeight) + 2 * props.virtualScrollNodePadding
  );

  const { tbodyScrollRef, scrollTop, onVScroll, handleVScrollEvent } = useVerticalScroll();

  let lastStartNode = 0;

  const offsetY = computed(() => startNode.value * props.rowHeight);

  const startNode = computed(() => {
    const tmpStart = Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - props.virtualScrollNodePadding);

    // don't update if it didn't change
    if (tmpStart === lastStartNode) return lastStartNode;

    if (
      // scrolled back to top
      (tmpStart === 0 && lastStartNode !== 0) ||
      // if the difference is over the padding
      Math.abs(lastStartNode - tmpStart) > props.virtualScrollNodePadding
    ) {
      lastStartNode = tmpStart;
      return tmpStart;
    }
    return lastStartNode;
  });

  const visibleRows = computed<VRow[]>(() =>
    props.rows.slice(startNode.value, startNode.value + maxVisibleCount.value)
  );

  return { tbodyScrollRef, scrollTop, visibleRows, offsetY, startNode, tbodyHeight, onVScroll, handleVScrollEvent };
}
