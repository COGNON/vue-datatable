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
import { watch } from 'vue';
import { VirtualScrollerProps } from '../types';
import useVirtualScroll from '../../composables/useVirtualScroll';

const props = defineProps<VirtualScrollerProps>();

// reset the scroll on page change back to the top
watch(
  () => props.currentPage,
  () => (scrollerRef.value.scrollTop = 0)
);

const {
  visibleRows,
  scrollerRef,
  offsetY,
  startNode,
  tbodyHeight,
  spacerStyle,
  overflowStyle,
  onVScroll
} = useVirtualScroll(props);
</script>

<style scoped>
.vdt--scroller {
  position: relative;
  overflow-x: auto;
}
</style>
