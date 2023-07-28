<template>
  <tbody :class="extraClasses.tbody">
    <template v-for="(row, rowIdx) in rows" :key="rowIdx">
      <table-row
        :class="extraClasses.row"
        :row="row"
        :columns="columns"
        :row-height="rowHeight"
        :selection="selection"
        :selected="selected[row.index] || false"
        :expanded="expandedRows[row.index] || false"
        :extra-classes="extraClasses"
        :handle-expand-icon="handleExpandIcon"
        @update-expanded-height="(val) => $emit('updateExpandedHeight', val)"
        @update-selected="$emit('updateSelected', row)"
        @update-expanded="(idx) => $emit('updateExpanded', idx)"
        @click="(e: MouseEvent) => $emit('onRowClick',e,row)"
        @dbl-click="(e: MouseEvent) => $emit('onRowDblClick',e,row)"
        @on-cell-click="(e, col) => $emit('onCellClick', e, col, row)"
        @on-cell-dbl-click="(e, col) => $emit('onCellDblClick', e, col, row)"
      >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps || {}" />
        </template>
      </table-row>

      <expand-row
        v-if="$slots['expanded']"
        v-show="expandedRows[row.index]"
        :row="row"
        :expanded="expandedRows[row.index] || false"
      >
        <template #expanded="slotProps">
          <slot name="expanded" v-bind="slotProps || {}" />
        </template>
      </expand-row>
    </template>
  </tbody>
</template>

<script setup lang="ts">
import {
  VRow,
  VExpandedRow,
  VSelectedRow,
  VSelectionModes,
  VColumn,
  VExtraClasses
} from '../types';
import TableRow from './TableRow.vue';
import ExpandRow from './ExpandRow.vue';

defineProps<{
  rows: VRow[];
  columns: VColumn[];
  rowHeight: number;
  colWidths: number;
  selection: VSelectionModes;
  selected: VSelectedRow;
  expandedRows: VExpandedRow;
  extraClasses: VExtraClasses;
  handleExpandIcon: boolean;
}>();

defineEmits<{
  (e: 'updateExpandedHeight', changeHeight: number): void;
  (e: 'updateSelected', row: VRow): void;
  (e: 'updateExpanded', index: number): void;
  (e: 'onRowClick', event: MouseEvent, row: VRow): void;
  (e: 'onRowDblClick', event: MouseEvent, row: VRow): void;
  (e: 'onCellClick', event: MouseEvent, col: VColumn, row: VRow): void;
  (e: 'onCellDblClick', event: MouseEvent, col: VColumn, row: VRow): void;
}>();
</script>
