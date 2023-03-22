<template>
  <div
    class="vdt--th"
    role="columnheader"
    tabindex="-1"
    aria-description="Press Enter to Sort"
  >
    <div
      class="vdt--th-resizer"
      @mousedown="(e) => $emit('onResizeStart', e)"
    />

    <div class="vdt--th-cell-wrapper" role="presentation">
      <div class="vdt--th-label-container" role="presentation">
        <div class="vdt--th-label" role="presentation">
          <span class="vdt--th-label-text">
            {{ col.header }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VColumn } from '../DataTable/types';

defineProps<{
  col: VColumn;
}>();

defineEmits<{
  (e: 'updateSorter', event: MouseEvent): void;
  (e: 'onResizeStart', event: MouseEvent): void;
}>();
</script>
