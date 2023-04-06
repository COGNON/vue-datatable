import { computed } from 'vue';
import useFakeVirtualScroll from './useVerticalScroll';
import { VRow } from 'src/components/types';

export default function useVirtualScroll(props: any) {
  const tbodyHeight = computed(() => props.rows.length * props.rowHeight + props.expandedRowHeight);
  const maxVisibleCount = computed(
    () => Math.ceil(props.rootHeight / props.rowHeight) + 2 * props.virtualScrollNodePadding
  );

  const { tbodyScrollRef, scrollTop, onVScroll, handleVScrollEvent } = useFakeVirtualScroll();

  const offsetY = computed(() => startNode.value * props.rowHeight);
  const startNode = computed(() => {
    const tmpStart = Math.floor(scrollTop.value / props.rowHeight) - props.virtualScrollNodePadding;
    return Math.max(0, tmpStart);
  });

  const visibleRows = computed<VRow[]>(() => {
    const visibleNodesCount = getVisibleNodesCount(startNode.value, props.rows.length);
    return props.rows.slice(startNode.value, startNode.value + visibleNodesCount);
  });

  function getVisibleNodesCount(startNode: number, rowCount: number): number {
    return Math.min(rowCount - startNode, maxVisibleCount.value);
  }

  return { tbodyScrollRef, scrollTop, visibleRows, offsetY, startNode, tbodyHeight, onVScroll, handleVScrollEvent };
}
