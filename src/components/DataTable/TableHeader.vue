<template>
  <thead class="vdt--thead">
    <tr :class="`vdt--thead-tr ${extraClasses.headerRow}`">
      <header-cell
        v-for="(col, colIdx) in columns"
        :key="col.colId"
        :col="col"
        :aria-colindex="colIdx + 1"
        :style="{ width: `${col.width}px`, textAlign: col.align }"
        :class="extraClasses.headerCell"
        :resizable-columns="resizableColumns"
        :draggable="reorderableColumns ? true : null"
        :total-row-count="totalRowCount"
        :selection="selection"
        :selected="selected"
        :allow-select-all="allowSelectAll"
        :sorters="sorters"
        @select-all="(val) => $emit('selectAll', val)"
        @update-sorter="(e) => $emit('updateSorter', e, col.colId)"
        @on-resize-start="(e) => $emit('onResizeStart', e, col)"
        @dragstart.stop="(e) => $emit('onDragStart', e)"
        v-on="
          reorderableColumns
            ? {
                dragend: (e) => $emit('onDragEnd', e),
                dragover: (e) => $emit('onDragOver', e),
                drop: (e) => $emit('onDrop', e)
              }
            : {}
        "
      >
        <!-- specific header cell slot takes precedence -->
        <template v-if="$slots[`header-cell-${col.colId}`]" #header-cell="slotProps">
          <slot :name="`header-cell-${col.colId}`" v-bind="slotProps" :col-index="colIdx" />
        </template>
        <template v-else-if="$slots['header-cell']" #header-cell="slotProps">
          <slot name="header-cell" v-bind="slotProps" :col-index="colIdx" />
        </template>

        <template v-if="col.filterable" #filter>
          <slot
            name="filter"
            :column="col"
            :filter-value="filters[col.colId]"
            :update-filter="updateFilter"
          >
            <vdt-input
              :model-value="filters[col.colId]"
              class="vdt--th-filter"
              @update:model-value="(val) => updateFilter(col.colId, String(val))"
            />
          </slot>
        </template>
      </header-cell>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import type { VRow, VColumn, VFilter, VSorter, VSelectionModes, VExtraClasses } from '../types';
import HeaderCell from './HeaderCell.vue';
import VdtInput from './VdtInput.vue';

defineProps<{
  scrollLeft: number;
  columns: Required<VColumn>[];
  rowHeight: number;
  resizableColumns: boolean;
  reorderableColumns: boolean;
  sorters: VSorter[];
  filters: VFilter;
  selection: VSelectionModes;
  selected: VRow[];
  totalRowCount: number;
  extraClasses: VExtraClasses;
  allowSelectAll: boolean;
}>();

const emit = defineEmits<{
  updateSorter: [event: MouseEvent, field: string];
  updateFilter: [field: string, val: string | null];
  onResizeStart: [event: MouseEvent, col: VColumn];
  onDragStart: [event: DragEvent];
  onDragEnd: [event: DragEvent];
  onDragOver: [event: DragEvent];
  onDrop: [event: DragEvent];
  selectAll: [selected: boolean];
}>();

const updateFilter = (field: string, val: string) => emit('updateFilter', field, val);
</script>
