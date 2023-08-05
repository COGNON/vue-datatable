import { computed, ref, watch } from 'vue';
import type { VirtualScrollerProps } from '../components/types';

export default function useVirtualScroll(props: VirtualScrollerProps) {
  const scrollerRef = ref<HTMLElement | null>(null);
  const scrollTop = ref(0);

  const onVScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    scrollTop.value = target.scrollTop;
  };

  const processedRows = computed(() => props.rows.map((r, idx) => ({ ...r, index: idx })));

  const tbodyHeight = computed(() => {
    if (props.rowsPerPage) {
      // if paging, return the total height of VISIBLE rows
      // OR the actual height of the table, whichever is greater
      // this is to ensure the horizontal scrollbar ends up at the bottom
      return (
        Math.max(
          props.rowHeight * visibleRows.value.length,
          scrollerRef.value?.clientHeight || props.rootHeight
        ) + props.expandedRowHeight
      );
    }
    // otherwise, return the height of ALL rows + any expanded rows
    return processedRows.value.length * props.rowHeight + props.expandedRowHeight;
  });

  const maxVisibleCount = computed(() =>
    Math.ceil((scrollerRef.value?.clientHeight || props.rootHeight) / props.rowHeight)
  );

  const startNode = ref(0);
  const offsetY = computed(() => {
    if (props.rowsPerPage) return 0;
    return startNode.value * props.rowHeight;
  });

  watch(scrollTop, () => {
    // if paging, ignore
    if (props.rowsPerPage) return;

    const tmpStart = Math.max(0, Math.floor(scrollTop.value / props.rowHeight));

    // don't update if it didn't change
    if (tmpStart === startNode.value) return startNode.value;

    if (tmpStart === 0 || Math.abs(tmpStart - startNode.value) > props.virtualScrollNodePadding) {
      startNode.value = tmpStart;
      return tmpStart;
    }
  });

  const visibleRows = computed(() => {
    if (props.rowsPerPage) {
      // if paging, get the row to start at, which is the current page * the rows per page
      const curStartIdx = props.currentPage * props.rowsPerPage;
      // then the row to end at is the start + rows per page
      return processedRows.value.slice(curStartIdx, curStartIdx + props.rowsPerPage);
    }

    // otherwise, get the current row slice based on startNode
    return processedRows.value.slice(
      Math.max(0, startNode.value - props.virtualScrollNodePadding),
      startNode.value + maxVisibleCount.value + props.virtualScrollNodePadding
    );
  });

  return {
    scrollTop,
    visibleRows,
    offsetY,
    startNode,
    tbodyHeight,
    scrollerRef,
    onVScroll
  };
}
