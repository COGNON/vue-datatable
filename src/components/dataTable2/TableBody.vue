<template>
  <table-row
    v-for="(row, rowIdx) in rows"
    :key="rowIdx"
    :row="row"
    :row-index="rowIdx + (virtualStartIsOdd ? 1 : 0)"
    :columns="columns"
    :style="{ height: `${rowHeight}px`, width: `${colWidths}px` }"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot v-if="String(slotName).startsWith('body')" :name="slotName" v-bind="slotProps || {}" />
    </template>
  </table-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VColumn } from '../DataTable/types';
import TableRow from './TableRow.vue';

const props = defineProps<{
  rows: any[];
  columns: VColumn[];
  rowHeight: number;
  colWidths: number;
  virtualStartNode: number;
}>();

// prevents striped rows from shifting as the virtual scroller moves by baselining the row index as if the count starts from 0
const virtualStartIsOdd = computed(() => props.virtualStartNode % 2 > 0);
</script>
