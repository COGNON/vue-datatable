<template>
  <table-row
    v-for="(item, idx) in rows"
    :key="item.id"
    :row="item"
    :line-height="lineHeight"
    :row-separator-cls="rowSeparatorCls"
    :col-separator-cls="colSeparatorCls"
    :hightlight-on-hover="hightlightOnHover"
    :striped-rows="idx % 2 ? stripedRows : false"
    :selection="selection"
    :selected="selectedRows[idx] || allSelected || false"
    :columns="columns"
    @on-select="(val) => $emit('onRowSelect', idx, val)"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot v-if="$slots[name]" :name="name" v-bind="slotData" />
    </template>
  </table-row>
</template>

<script setup lang="ts">
import { SelectedRow, SelectionModes, VColumn } from './types';
import TableRow from './TableRow.vue';

interface VScrollerProps {
  rows: any[];
  columns: VColumn[];
  lineHeight: number;
  rowSeparatorCls: string;
  colSeparatorCls: string;
  hightlightOnHover: boolean;
  stripedRows: boolean;
  selection: SelectionModes;
  allSelected: boolean;
  selectedRows: SelectedRow;
}

withDefaults(defineProps<VScrollerProps>(), {
  rows: () => [],
});

defineEmits<{
  (e: 'onRowSelect', rowIdx: number, val: boolean): void;
}>();
</script>

<style lang="scss" scoped></style>
