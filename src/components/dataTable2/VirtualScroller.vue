<template>
  <div class="vdt--tbody" role="presentation" :style="tbodyStyle">
    <div class="vdt--tbody-clipper" role="presentation">
      <div ref="tbodyScrollRef" class="vdt--tbody-viewport" role="presentation">
        <div class="vdt--tbody-container" role="rowgroup" :style="tbodyContainerStyle">
          <slot :virtual-rows="visibleRows" :start-node="startNode" />
        </div>
      </div>
    </div>

    <!-- fake vertical scroll -->
    <fake-vertical-scroll :tbody-height="tbodyHeight" :scroll-top="scrollTop" @handle-scroll="handleVScrollEvent" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { VColumn } from '../DataTable/types';
import FakeVerticalScroll from './FakeVerticalScroll.vue';
import useVirtualScroll from 'src/composables/useVirtualScroll';

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

const { tbodyScrollRef, scrollTop, visibleRows, offsetY, startNode, onVScroll, handleVScrollEvent } =
  useVirtualScroll(props);

const tbodyHeight = computed(() => props.rows.length * props.rowHeight);

onMounted(() => tbodyScrollRef.value?.addEventListener('scroll', onVScroll));

const tbodyStyle = computed(() => {
  return { height: `${tbodyHeight.value}px` };
});

const tbodyContainerStyle = computed(() => {
  return {
    width: `${props.colWidths}px`,
    transform: `translate(${-props.scrollLeft}px,${offsetY.value}px)`,
  };
});
</script>
