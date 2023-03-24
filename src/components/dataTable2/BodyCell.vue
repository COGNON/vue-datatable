<template>
  <div
    class="vdt--cell"
    :aria-colcount="colIdx + 1"
    tabindex="-1"
    role="gridcell"
    :style="{ width: `${col.width}px` }"
  >
    <slot
      name="body-cell"
      :col="col"
      :row="row"
      :value="value"
      :col-index="colIdx"
    >
      {{ value }}
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VColumn } from '../DataTable/types';

const props = defineProps<{
  row: any;
  col: VColumn;
  colIdx: number;
}>();

const value = computed(() => {
  if (typeof props.col.field === 'string') return props.row[props.col.field];
  else return props.col.field(props.row);
});
</script>
