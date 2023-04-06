<template>
  <td
    class="vdt--cell"
    :aria-colcount="colIdx + 1"
    tabindex="-1"
    :style="{ width: `${col.width}px` }"
    @click="(e: MouseEvent) => $emit('onCellClick',e,row,col)"
    @dbl-click="(e:MouseEvent) => $emit('onCellDblClick',e,row,col)"
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
  (e: 'onCellClick', event: MouseEvent, row: any, col: VColumn): void;
  (e: 'onCellDblClick', event: MouseEvent, row: any, col: VColumn): void;
}>();

const value = computed(() => {
  if (typeof props.col.field === 'string') return props.row[props.col.field];
  else return props.col.field(props.row);
});
</script>
