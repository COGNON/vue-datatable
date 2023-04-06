<template>
  <tbody>
    <table-row
      v-for="(row, rowIdx) in rows"
      :key="rowIdx"
      :row="row"
      :row-index="rowIdx + virtualStartNode"
      :columns="columns"
      :row-height="rowHeight"
      :selection="selection"
      :selected="selected[row[rowKey]] || false"
      :expanded="expandedRows[rowIdx + virtualStartNode] || false"
      @update-expanded-height="(val) => $emit('updateExpandedHeight', val)"
      @update-selected="$emit('updateSelected', row)"
      @update-expanded="(idx) => $emit('updateExpanded', idx)"
      @click="(e: MouseEvent) => $emit('onRowClick',e,row)"
      @dbl-click="(e: MouseEvent) => $emit('onRowDblClick',e,row)"
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
import { VSelectedRow, VSelectionModes, VColumn } from '../types';
import TableRow from './TableRow.vue';

defineProps<{
  rows: any[];
  columns: VColumn[];
  rowHeight: number;
  colWidths: number;
  virtualStartNode: number;
  selection: VSelectionModes;
  selected: VSelectedRow;
  rowKey: string;
  expandedRows: VSelectedRow;
}>();

defineEmits<{
  (e: 'updateExpandedHeight', changeHeight: number): void;
  (e: 'updateSelected', row: any): void;
  (e: 'updateExpanded', index: number): void;
  (e: 'onRowClick', event: MouseEvent, row: any): void;
  (e: 'onRowDblClick', event: MouseEvent, row: any): void;
}>();
</script>
