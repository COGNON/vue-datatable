<template>
  <div class="vdt--tbody" role="presentation">
    <div class="vdt--tbody-clipper" role="presentation">
      <div ref="tbodyScrollRef" class="vdt--tbody-viewport" role="presentation">
        <table class="vdt--tbody-container" :style="tbodyContainerStyle">
          <slot :paged-rows="rows[currentPage]" :start-node="currentPage * pagination.rowsPerPage" />
        </table>
      </div>
    </div>

    <!-- fake vertical scroll -->
    <fake-vertical-scroll :tbody-height="tbodyHeight" :scroll-top="scrollTop" @handle-scroll="handleVScrollEvent" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { VColumn, VPagination } from '../types';
import FakeVerticalScroll from './FakeVerticalScroll.vue';
import useVirtualScroll from 'src/composables/useVirtualScroll';

const props = defineProps<{
  rows: any[];
  columns: VColumn[];
  rowHeight: number;
  rootHeight: number;
  colWidths: number;
  scrollLeft: number;
  expandedRowHeight: number;
  pagination: VPagination;
  currentPage: number;
}>();

const { tbodyScrollRef, scrollTop, onVScroll, handleVScrollEvent } = useVirtualScroll(props);

onMounted(() => tbodyScrollRef.value?.addEventListener('scroll', onVScroll));
watch(
  () => props.currentPage,
  () => tbodyScrollRef.value?.scrollTo({ top: 0 })
);

// either the height of the # of rows per page, or the height of the actual # of rows on the current page if it's smaller
const tbodyHeight = computed(() =>
  Math.min(
    props.pagination.rowsPerPage * props.rowHeight + props.expandedRowHeight,
    props.rows[props.currentPage].length * props.rowHeight
  )
);

const tbodyContainerStyle = computed(() => {
  return {
    width: `${props.colWidths}px`,
    transform: `translate(${-props.scrollLeft}px,0px)`,
  };
});
</script>
