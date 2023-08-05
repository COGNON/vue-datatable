<template>
  <div
    ref="scrollerRef"
    :style="{ overflowY: overflowStyle }"
    class="vdt--scroller"
    role="presentation"
    @scroll="onVScroll"
  >
    <slot
      :virtual-rows="visibleRows"
      :start-node="startNode"
      :offset-y="offsetY"
      :table-height="tbodyHeight"
      :spacer-style="spacerStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { VirtualScrollerProps } from '../types';
import useVirtualScroll from '../../composables/useVirtualScroll';

const props = defineProps<VirtualScrollerProps>();

watch(
  () => props.currentPage,
  () => (scrollerRef.value.scrollTop = 0)
);

const { visibleRows, scrollerRef, offsetY, startNode, tbodyHeight, onVScroll } =
  useVirtualScroll(props);

const overflowStyle = computed(() =>
  props.rowsPerPage && tbodyHeight.value === scrollerRef.value?.clientHeight ? 'hidden' : 'auto'
);

const spacerStyle = computed(() => {
  // virtual scroll calculation is the total height of the rows
  // minus the total visible row height and any expanded row height
  return tbodyHeight.value - visibleRows.value.length * props.rowHeight - props.expandedRowHeight;
});
</script>

<style scoped>
.vdt--scroller {
  position: relative;
  overflow-x: auto;
}
</style>
