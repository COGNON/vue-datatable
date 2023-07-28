<template>
  <div class="vdt--tbody-hscroll" aria-hidden="true" :style="{ ...scrollStyle, display: showScrollbar }">
    <div class="vdt--tbody-hscroll-lspacer" :style="lSpacerStyle" />
    <div
      class="vdt--tbody-hscroll-viewport"
      :style="scrollStyle"
      @mousedown="(e) => handleHScrollEvent(e, true)"
      @mouseup="(e) => handleHScrollEvent(e, false)"
    >
      <div class="vdt--tbody-hscroll-container" :style="{ ...scrollStyle, width: `${colWidths}px` }" />
    </div>
    <div class="vdt--tbody-hscroll-rspacer" :style="rSpacerStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useHorizontalScroll from '../../composables/useHorizontalScroll';

const props = defineProps<{ colWidths: number; clientWidth: number }>();
const emit = defineEmits<{ (e: 'updateScroll', val: number): void }>();
const { handleHScrollEvent } = useHorizontalScroll(emit);

const showScrollbar = computed(() => (props.colWidths > props.clientWidth - 15 ? 'flex' : 'none'));

const rSpacerStyle = { width: '15px', maxWidth: '15px', minWidth: '15px' };
const lSpacerStyle = { width: '0px', maxWidth: '0px', minWidth: '0px' };
const scrollStyle = {
  height: '15px',
  maxHeight: '15px',
  minHeight: '15px',
};
</script>
