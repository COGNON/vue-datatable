<template>
  <thead class="vdt--thead">
    <tr :class="`vdt--thead-tr ${extraClasses.headerRow}`">
      <th v-if="selection !== 'none'" class="vdt--th vdt--th-extra">
        <slot name="header-selection" :all-selected="allSelected" :select-all="selectAll">
          <vdt-checkbox
            v-if="allowSelectAll && selection === 'multiple'"
            :model-value="allSelected"
            @update:model-value="selectAll"
          />
        </slot>
      </th>
      <th v-if="$slots['expanded']" class="vdt--th vdt--th-extra" />

      <header-cell
        v-for="(col, colIdx) in columns"
        :key="col.colId"
        :col="col"
        :aria-colindex="colIdx + 1"
        :style="{ width: `${col.width}px`, textAlign: col.align }"
        :class="extraClasses.headerCell"
        :resizable-columns="resizableColumns"
        :draggable="reorderableColumns ? true : null"
        :sorters="sorters"
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
import { computed } from 'vue';
import type { VRow, VColumn, VFilter, VSorter, VSelectionModes, VExtraClasses } from '../types';
import HeaderCell from './HeaderCell.vue';
import VdtCheckbox from './VdtCheckbox.vue';
import VdtInput from './VdtInput.vue';

const props = defineProps<{
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

const allSelected = computed(() => props.selected.length === props.totalRowCount);
const selectAll = (val: boolean) => emit('selectAll', val);

const updateFilter = (field: string, val: string) => emit('updateFilter', field, val);
</script>
