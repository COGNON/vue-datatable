<template>
  <thead class="vdt--thead-container" :style="theadContainerStyle">
    <tr class="vdt--thead-tr">
      <th v-if="selection !== 'none'" class="vdt--th vdt--th-extra">
        <slot name="header-selection" :all-selected="allSelected" :select-all="selectAll">
          <q-checkbox
            v-if="selection === 'multiple'"
            :model-value="allSelected"
            dense
            @update:model-value="selectAll"
          />
        </slot>
      </th>
      <th v-if="$slots['expanded']" class="vdt--th vdt--th-extra" />

      <header-cell
        v-for="(col, colIdx) in columns"
        :key="col.name"
        :col="col"
        :aria-colindex="colIdx + 1"
        :style="{ width: `${col.width}px` }"
        :resizable-columns="resizableColumns"
        :draggable="reorderableColumns ? true : null"
        :sorters="sorters"
        @update-sorter="(e) => $emit('updateSorter', e, col.name)"
        @on-resize-start="(e: MouseEvent) => $emit('onResizeStart', e, col)"
        @dragstart.stop="(e:DragEvent) => $emit('onDragStart',e)"
        v-on="reorderableColumns ? {
              dragend: (e:DragEvent) => $emit('onDragEnd', e),
              dragover: (e:DragEvent) => $emit('onDragOver', e),
              drop: (e:DragEvent) => $emit('onDrop',e)
            } : {}"
      >
        <!-- specific header cell slot takes precedence -->
        <template v-if="$slots[`header-cell-${col.name}`]" #header-cell="slotProps">
          <slot :name="`header-cell-${col.name}`" v-bind="slotProps" :col-index="colIdx" />
        </template>
        <template v-else-if="$slots['header-cell']" #header-cell="slotProps">
          <slot name="header-cell" v-bind="slotProps" :col-index="colIdx" />
        </template>

        <template #filter>
          <filter-cell
            v-if="colIdx !== 1"
            :col="col"
            :filter="filters[col.name] || ''"
            @update:model-value="(val) => $emit('updateFilter', col.field, val)"
          />
        </template>
      </header-cell>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VColumn, VFilter, VSorter, VSelectionModes } from '../types';
import HeaderCell from './HeaderCell.vue';
import FilterCell from './FilterCell.vue';

const props = defineProps<{
  scrollLeft: number;
  columns: VColumn[];
  rowHeight: number;
  resizableColumns: boolean;
  reorderableColumns: boolean;
  sorters: VSorter[];
  filters: VFilter;
  selection: VSelectionModes;
  selected: any[];
  totalRowCount: number;
}>();

const emit = defineEmits<{
  (e: 'updateSorter', event: MouseEvent, field: string): void;
  (e: 'updateFilter', field: string, val: string | null): void;
  (e: 'onResizeStart', event: MouseEvent, col: VColumn): void;
  (e: 'onDragStart', event: DragEvent): void;
  (e: 'onDragEnd', event: DragEvent): void;
  (e: 'onDragOver', event: DragEvent): void;
  (e: 'onDrop', event: DragEvent): void;
  (e: 'selectAll', selected: boolean): void;
}>();

const theadContainerStyle = computed(() => {
  return { transform: `translateX(${-props.scrollLeft}px)` };
});

const allSelected = computed(() => props.selected.length === props.totalRowCount);
const selectAll = (val: boolean) => emit('selectAll', val);
</script>
