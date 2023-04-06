<template>
  <div class="vdt--tbody" role="presentation">
    <div class="vdt--tbody-clipper" role="presentation">
      <div ref="tbodyScrollRef" class="vdt--tbody-viewport" role="presentation">
        <table class="vdt--tbody-container" role="rowgroup" :style="tbodyContainerStyle">
          <slot :virtual-rows="visibleRows" :start-node="startNode" />
        </table>
      </div>
    </div>

    <!-- fake vertical scroll -->
    <fake-vertical-scroll :tbody-height="tbodyHeight" :scroll-top="scrollTop" @handle-scroll="handleVScrollEvent" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { VRow, VColumn } from '../types';
import FakeVerticalScroll from './FakeVerticalScroll.vue';
import useVirtualScroll from 'src/composables/useVirtualScroll';

const props = defineProps<{
  rows: VRow[];
  columns: VColumn[];
  rowHeight: number;
  virtualScrollNodePadding: number;
  rootHeight: number;
  colWidths: number;
  scrollLeft: number;
  stripedRows: boolean;
  expandedRowHeight: number;
}>();

const { tbodyScrollRef, scrollTop, visibleRows, offsetY, startNode, tbodyHeight, onVScroll, handleVScrollEvent } =
  useVirtualScroll(props);

onMounted(() => tbodyScrollRef.value?.addEventListener('scroll', onVScroll));

const tbodyContainerStyle = computed(() => {
  return {
    width: `${props.colWidths}px`,
    transform: `translate(${-props.scrollLeft}px,${offsetY.value}px)`,
  };
});
</script>
