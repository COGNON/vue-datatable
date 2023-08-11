<template>
  <div
    ref="scrollerRef"
    :style="{ overflowY: overflowStyle }"
    class="vdt--scroller vdt--custom-scrollbar"
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
import { VirtualScrollerProps } from '../types';
import useVirtualScroll from '../../composables/useVirtualScroll';

const props = defineProps<VirtualScrollerProps>();

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

<style lang="scss" scoped>
.vdt--scroller {
  position: relative;
  overflow-x: auto;
}
.vdt--custom-scrollbar {
  &::-webkit-scrollbar {
    $size: 10px;
    width: $size;
    height: $size;
  }
  &::-webkit-scrollbar-corner,
  &::-webkit-scrollbar-track {
    background-color: var(--vt-c-black-mute);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--vt-c-text-dark-2);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--vt-c-text-dark-1);
  }
}
</style>
