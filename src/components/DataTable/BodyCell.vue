<template>
  <td
    class="vdt--cell"
    :aria-colcount="colIdx + 1"
    tabindex="-1"
    @click="(e) => $emit('onCellClick', e)"
    @dbl-click="(e) => $emit('onCellDblClick', e)"
  >
    <slot name="body-cell" :col="col" :row="row" :value="value" :col-index="colIdx">
      {{ value }}
    </slot>
  </td>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VColumn } from '../types';

const props = defineProps<{
  row: any;
  col: VColumn;
  colIdx: number;
}>();

defineEmits<{
  onCellClick: [event: MouseEvent];
  onCellDblClick: [event: MouseEvent];
}>();

const value = computed(() => {
  if (typeof props.col.field === 'string') return props.row[props.col.field];
  else return props.col.field(props.row);
});
</script>
