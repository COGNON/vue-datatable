<template>
  <div
    ref="scrollRef"
    class="vdt--tbody-vscroll-viewport"
    :style="scrollStyle"
    @mousedown="(e) => $emit('handleScroll', e, true)"
    @mouseup="(e) => $emit('handleScroll', e, false)"
  >
    <div class="vdt--tbody-vscroll-container" :style="{ ...scrollStyle, height: `${tbodyHeight}px` }" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const scrollRef = ref<HTMLElement | undefined>();
const scrollStyle = { width: '15px', maxWidth: '15px', minWidth: '15px' };

const props = defineProps<{
  tbodyHeight: number;
  scrollTop: number;
}>();

watch(
  () => props.scrollTop,
  (newTop) => {
    if (scrollRef.value) scrollRef.value.scrollTop = newTop;
  }
);

defineEmits<{ (e: 'handleScroll', event: MouseEvent, add: boolean): void }>();
</script>
