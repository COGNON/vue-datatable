import { computed } from 'vue';
import useFakeVirtualScroll from './useFakeVirtualScroll';

export default function useVirtualScroll(props: any) {
  const tbodyHeight = computed(() => props.rows.length * props.rowHeight + props.expandedRowHeight);

  const { tbodyScrollRef, scrollTop, onVScroll, handleVScrollEvent } = useFakeVirtualScroll();

  const visibleNodesCount = computed(() => getVisibleNodesCount(startNode.value, props.rows.length));
  const offsetY = computed(() => startNode.value * props.rowHeight);
  const startNode = computed(() => getStartNode(scrollTop.value));
  const visibleRows = computed<any[]>(() =>
    props.rows.slice(startNode.value, startNode.value + visibleNodesCount.value)
  );

  function getStartNode(scrollTop: number): number {
    const tmpStart = Math.floor(scrollTop / props.rowHeight) - props.virtualScrollNodePadding;
    return Math.max(0, tmpStart);
  }

  function getVisibleNodesCount(startNode: number, rowCount: number): number {
    const count = Math.ceil(props.rootHeight / props.rowHeight) + 2 * props.virtualScrollNodePadding;
    return Math.min(rowCount - startNode, count);
  }

  return { tbodyScrollRef, scrollTop, visibleRows, offsetY, startNode, tbodyHeight, onVScroll, handleVScrollEvent };
}
