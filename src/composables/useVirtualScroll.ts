import { computed, ref } from 'vue';

export default function useVirtualScroll(props: any) {
  const tbodyScrollRef = ref<HTMLElement | undefined>();
  const scrollTop = ref(0);
  const tbodyHeight = computed(() => props.rows.length * props.rowHeight + props.expandedRowHeight);

  const visibleNodesCount = computed(() => getVisibleNodesCount(startNode.value, props.rows.length));
  const offsetY = computed(() => startNode.value * props.rowHeight);
  const startNode = computed(() => getStartNode(scrollTop.value));
  const visibleRows = computed<any[]>(() =>
    props.rows.slice(startNode.value, startNode.value + visibleNodesCount.value)
  );

  const onVScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const top = target.scrollTop;
    scrollTop.value = top;
    if (tbodyScrollRef.value) tbodyScrollRef.value.scrollTop = top;
  };

  function getStartNode(scrollTop: number): number {
    const tmpStart = Math.floor(scrollTop / props.rowHeight) - props.virtualScrollNodePadding;
    return Math.max(0, tmpStart);
  }

  function getVisibleNodesCount(startNode: number, rowCount: number): number {
    const count = Math.ceil(props.rootHeight / props.rowHeight) + 2 * props.virtualScrollNodePadding;
    return Math.min(rowCount - startNode, count);
  }

  function handleVScrollEvent(e: MouseEvent, attach: boolean) {
    if (attach) {
      tbodyScrollRef.value?.removeEventListener('scroll', onVScroll);
      e.target?.addEventListener('scroll', onVScroll);
    } else {
      e.target?.removeEventListener('scroll', onVScroll);
      tbodyScrollRef.value?.addEventListener('scroll', onVScroll);
    }
  }

  return { tbodyScrollRef, scrollTop, visibleRows, offsetY, startNode, tbodyHeight, onVScroll, handleVScrollEvent };
}
