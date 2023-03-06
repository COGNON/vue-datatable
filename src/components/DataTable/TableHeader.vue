<template>
  <div :class="`vdt-thead ${rowSeparatorCls}`">
    <div
      v-if="$slots['expanded']"
      :class="`vdt-th ${colSeparatorCls}`"
      style="width: 60px"
    ></div>

    <div
      v-if="selection !== 'none'"
      :class="`vdt-th vdt-th--selection ${colSeparatorCls}`"
      style="width: 60px"
    >
      <slot name="header-cell-selection">
        <q-checkbox
          v-if="selection === 'multiple'"
          v-model="allSelected"
          @update:model-value="(val) => $emit('onSelectAll', val)"
        />
      </slot>
    </div>

    <template v-for="col in columns" :key="col.field">
      <header-cell
        :column="col"
        :class="`vdt-th ${colSeparatorCls}`"
        :style="`width:${col.width}px;`"
        :sorter="sorters[col.field]"
        :resizable-columns="resizableColumns"
        :field="col.field"
        @update-sorter="(e) => $emit('updateSorter', e, col.field)"
        @on-resize-start="(e) => $emit('onResizeStart', e, col)"
        @dragstart="(e:DragEvent) => $emit('onDragStart',e)"
        @dragend="(e:DragEvent) => $emit('onDragEnd', e)"
        @dragover="(e:DragEvent) => $emit('onDragOver', e)"
        @drop="(e:DragEvent) => $emit('onDrop',e)"
      >
        <template v-if="$slots[`header-cell-${col.field}`]" #header-cell>
          <slot :name="`header-cell-${col.field}`"></slot>
        </template>
        <template v-else-if="$slots['header-cell']" #header-cell>
          <slot name="header-cell"></slot>
        </template>

        <template #filter>
          <slot name="filter" :col="col"></slot>
        </template>
      </header-cell>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { SelectedRow, SelectionModes, VColumn, VSorter } from './types';
import HeaderCell from './HeaderCell.vue';

interface VHeaderProps {
  columns: VColumn[];
  rowSeparatorCls: string;
  colSeparatorCls: string;
  sorters: VSorter;
  reorderableColumns: boolean;
  resizableColumns: boolean;
  selection: SelectionModes;
  selectedRows: SelectedRow;
  rowNumber: number;
}

const props = defineProps<VHeaderProps>();

defineEmits<{
  (e: 'updateSorter', event: MouseEvent, field: string): void;
  (e: 'onResizeStart', event: MouseEvent, col: VColumn): void;
  (e: 'onDragStart', event: DragEvent): void;
  (e: 'onDragEnd', event: DragEvent): void;
  (e: 'onDragOver', event: DragEvent): void;
  (e: 'onDrop', event: DragEvent): void;
  (e: 'onSelectAll', checked: boolean): void;
}>();

const allSelected = ref(false);
watch(
  () => props.selectedRows,
  (newSelected) =>
    newSelected && Object.keys(newSelected).length === props.rowNumber
      ? (allSelected.value = true)
      : null
);
</script>

<style lang="scss" scoped>
.vdt-thead {
  display: flex;
}
.vdt-th {
  padding: 5px;
}
.vdt-th--selection {
  text-align: center;
  vertical-align: middle;
}
</style>
