<template>
  <div :class="`vdt-thead ${rowSeparatorCls}`" role="presentation">
    <div v-if="selection !== 'none'" :class="`vdt-th vdt-th--selection vdt-cell--extra ${colSeparatorCls}`">
      <slot name="header-cell-selection">
        <q-checkbox
          v-if="selection === 'multiple'"
          v-model="allSelected"
          @update:model-value="(val) => $emit('onSelectAll', val)"
        />
      </slot>
    </div>

    <div v-if="$slots['expanded']" :class="`vdt-th vdt-td--expand ${colSeparatorCls}`" />

    <template v-for="col in columns" :key="col.field">
      <header-cell
        :column="col"
        :class="`vdt-th ${colSeparatorCls}`"
        :style="`width:${col.width}px;`"
        :sorter="sorters[col.name]"
        :resizable-columns="resizableColumns"
        :field="col.field"
        :draggable="true"
        @update-sorter="(e) => $emit('updateSorter', e, col.name)"
        @on-resize-start="(e) => $emit('onResizeStart', e, col)"
        @dragstart.stop="(e:DragEvent) => $emit('onDragStart',e)"
        @dragend="(e:DragEvent) => $emit('onDragEnd', e)"
        @dragover="(e:DragEvent) => $emit('onDragOver', e)"
        @drop="(e:DragEvent) => $emit('onDrop',e)"
      >
        <template v-if="$slots[`header-cell-${col.field}`]" #header-cell>
          <slot :name="`header-cell-${col.field}`" />
        </template>
        <template v-else-if="$slots['header-cell']" #header-cell>
          <slot name="header-cell" />
        </template>

        <template #filter>
          <slot name="filter" :col="col" />
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
    newSelected && Object.keys(newSelected).length === props.rowNumber ? (allSelected.value = true) : null
);
</script>

<style lang="scss" scoped>
.vdt-thead {
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;
  width: fit-content;
  background-color: var(--q-dark-page);
}
.vdt-th {
  padding: 5px;
  display: inline-block;
}
.vdt-th--selection {
  text-align: center;
  vertical-align: middle;
}
</style>
