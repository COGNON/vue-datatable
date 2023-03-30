<template>
  <tbody>
    <table-row
      v-for="(row, rowIdx) in rows"
      :key="rowIdx"
      :row="row"
      :row-index="rowIdx + (virtualStartIsOdd ? 1 : 0)"
      :columns="columns"
      :row-height="rowHeight"
      :selection="selection"
      :selected="selected[row[rowKey]] || false"
      @update-expanded-height="(val) => $emit('updateExpandedHeight', val)"
      @update-selected="$emit('updateSelected', row)"
    >
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot
          v-if="String(slotName).startsWith('body') || String(slotName).startsWith('expanded')"
          :name="slotName"
          v-bind="slotProps || {}"
        />
      </template>
    </table-row>
  </tbody>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VSelectedRow, VSelectionModes, VColumn } from '../types';
import TableRow from './TableRow.vue';

const props = defineProps<{
  rows: any[];
  columns: VColumn[];
  rowHeight: number;
  colWidths: number;
  virtualStartNode?: number;
  selection: VSelectionModes;
  selected: VSelectedRow;
  rowKey: string;
}>();

defineEmits<{
  (e: 'updateExpandedHeight', changeHeight: number): void;
  (e: 'updateSelected', row: any): void;
}>();

// prevents striped rows from shifting as the virtual scroller moves by baselining the row index as if the count starts from 0
const virtualStartIsOdd = computed(() => props.virtualStartNode || 0 % 2 > 0);
</script>
