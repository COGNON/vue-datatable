<template>
  <div class="vdt--tbody" role="presentation" :style="tbodyStyle">
    <div class="vdt--tbody-clipper" role="presentation">
      <div ref="tbodyScrollRef" class="vdt--tbody-viewport" role="presentation" :style="tbodyViewportStyle">
        <div class="vdt--tbody-container" role="rowgroup" :style="tbodyContainerStyle">
          <slot :processed-rows="visibleRows" :start-node="startNode" />
        </div>
      </div>
    </div>

    <!-- fake vertical scroll -->
    <fake-vertical-scroll :tbody-height="tbodyHeight" :scroll-top="scrollTop" @handle-scroll="handleVScrollEvent" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { VColumn } from '../DataTable/types';
import FakeVerticalScroll from './FakeVerticalScroll.vue';

const props = defineProps<{
  rows: any[];
  columns: VColumn[];
  rowHeight: number;
  virtualScrollNodePadding: number;
  rootHeight: number;
  colWidths: number;
  scrollLeft: number;
  stripedRows: boolean;
}>();

const tbodyScrollRef = ref<HTMLElement | undefined>();
const scrollTop = ref(0);
const tbodyHeight = computed(() => props.rows.length * props.rowHeight);

const onVScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const top = target.scrollTop;
  scrollTop.value = top;
  if (tbodyScrollRef.value) tbodyScrollRef.value.scrollTop = top;
};

onMounted(() => tbodyScrollRef.value?.addEventListener('scroll', onVScroll));

const visibleNodesCount = computed(() => getVisibleNodesCount(startNode.value, props.rows.length));
const offsetY = computed(() => startNode.value * props.rowHeight);
const startNode = computed(() => getStartNode(scrollTop.value));

function getStartNode(scrollTop: number): number {
  let tmpStart = Math.floor(scrollTop / props.rowHeight) - props.virtualScrollNodePadding;
  return Math.max(0, tmpStart);
}

function getVisibleNodesCount(startNode: number, rowCount: number): number {
  const count = Math.ceil(props.rootHeight / props.rowHeight) + 2 * props.virtualScrollNodePadding;
  return Math.min(rowCount - startNode, count);
}

const visibleRows = computed<any[]>(() => props.rows.slice(startNode.value, startNode.value + visibleNodesCount.value));

const tbodyStyle = computed(() => {
  return { height: `${tbodyHeight.value}px` };
});

const tbodyContainerStyle = computed(() => {
  return {
    width: `${props.colWidths}px`,
    transform: `translate(${-props.scrollLeft}px,${offsetY.value}px)`,
  };
});

const tbodyViewportStyle = computed(() => {
  return { width: 'calc(100% + 15px)' };
});

function handleVScrollEvent(e: MouseEvent, attach: boolean) {
  if (attach) {
    tbodyScrollRef.value?.removeEventListener('scroll', onVScroll);
    e.target?.addEventListener('scroll', onVScroll);
  } else {
    e.target?.removeEventListener('scroll', onVScroll);
    tbodyScrollRef.value?.addEventListener('scroll', onVScroll);
  }
}
</script>
