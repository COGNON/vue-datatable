<template>
  <tbody :class="extraClasses.tbody">
    <template v-for="(row, rowIdx) in rows" :key="rowIdx">
      <table-row
        :class="extraClasses.row"
        :row="row"
        :columns="columns"
        :row-height="rowHeight"
        :selection="selection"
        :selected="selected[row[rowKey]] || false"
        :expanded="expandedRows[row[rowKey]] || false"
        :extra-classes="extraClasses"
        :handle-expand-icon="handleExpandIcon"
        @update-expanded-height="(val) => $emit('updateExpandedHeight', val)"
        @update-selected="$emit('updateSelected', row)"
        @update-expanded="$emit('updateExpanded', row)"
        @click="(e) => $emit('onRowClick', e, row)"
        @dbl-click="(e) => $emit('onRowDblClick', e, row)"
        @on-cell-click="(e, col) => $emit('onCellClick', e, col, row)"
        @on-cell-dbl-click="(e, col) => $emit('onCellDblClick', e, col, row)"
      >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps || {}" />
        </template>
      </table-row>

      <expand-row
        v-if="$slots['expanded'] && expandedRows[row[rowKey]]"
        :row="row"
        :expanded="expandedRows[row[rowKey]] || false"
        :col-num="columns.length"
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
  rowKey: string;
  columns: Required<VColumn>[];
  rowHeight: number;
  colWidths: number;
  selection: VSelectionModes;
  selected: VSelectedRow;
  expandedRows: VExpandedRow;
  extraClasses: VExtraClasses;
  handleExpandIcon: boolean;
}>();

defineEmits<{
  updateExpandedHeight: [changeHeight: number];
  updateSelected: [row: VRow];
  updateExpanded: [row: VRow];
  onRowClick: [event: MouseEvent, row: VRow];
  onRowDblClick: [event: MouseEvent, row: VRow];
  onCellClick: [event: MouseEvent, col: VColumn, row: VRow];
  onCellDblClick: [event: MouseEvent, col: VColumn, row: VRow];
}>();
</script>
