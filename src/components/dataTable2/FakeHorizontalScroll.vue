<template>
  <div class="vdt--tbody-hscroll" aria-hidden="true" :style="scrollStyle">
    <div class="vdt--tbody-hscroll-lspacer" :style="lSpacerStyle" />
    <div
      class="vdt--tbody-hscroll-viewport"
      :style="scrollStyle"
      @mousedown="(e) => handleHScrollEvent(e, true)"
      @mouseup="(e) => handleHScrollEvent(e, false)"
    >
      <div
        class="vdt--tbody-hscroll-container"
        :style="{ ...scrollStyle, width: `${colWidths}px` }"
      />
    </div>
    <div class="vdt--tbody-hscroll-rspacer" :style="rSpacerStyle" />
  </div>
</template>

<script setup lang="ts">
const rSpacerStyle = { width: '15px', maxWidth: '15px', minWidth: '15px' };
const lSpacerStyle = { width: '0px', maxWidth: '0px', minWidth: '0px' };
const scrollStyle = {
  height: '15px',
  maxHeight: '15px',
  minHeight: '15px',
};

defineProps<{ colWidths: number }>();
const emit = defineEmits<{ (e: 'updateScroll', val: number): void }>();

const onHScroll = (event: Event) =>
  emit('updateScroll', (event.target as HTMLElement).scrollLeft);

function handleHScrollEvent(e: MouseEvent, attach: boolean) {
  if (attach) e.target?.addEventListener('scroll', onHScroll);
  else e.target?.removeEventListener('scroll', onHScroll);
}
</script>
