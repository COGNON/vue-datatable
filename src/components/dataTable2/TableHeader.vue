<template>
  <div class="vdt--thead-wrapper" role="presentation" :style="theadStyle">
    <div class="vdt--thead" role="presentation">
      <div class="vdt--thead-container" role="rowgroup" :style="theadContainerStyle">
        <div class="vdt--thead-tr" role="row" aria-rowindex="1" :style="theadTrStyle">
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
          </header-cell>
        </div>

        <div
          class="vdt--thead-filters"
          role="row"
          aria-rowindex="2"
          :style="{ ...theadTrStyle, top: `${rowHeight}px` }"
        >
          <filter-cell v-for="(col, colIdx) in columns" :key="colIdx" :col="col" :filter="filters[col.name] || ''" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VColumn, VFilter, VSorter } from '../DataTable/types';
import HeaderCell from './HeaderCell.vue';
import FilterCell from './FilterCell.vue';

const props = defineProps<{
  colWidths: number;
  scrollLeft: number;
  columns: VColumn[];
  rowHeight: number;
  resizableColumns: boolean;
  reorderableColumns: boolean;
  sorters: VSorter[];
  filters: VFilter;
}>();

defineEmits<{
  (e: 'updateSorter', event: MouseEvent, field: string): void;
  (e: 'onResizeStart', event: MouseEvent, col: VColumn): void;
  (e: 'onDragStart', event: DragEvent): void;
  (e: 'onDragEnd', event: DragEvent): void;
  (e: 'onDragOver', event: DragEvent): void;
  (e: 'onDrop', event: DragEvent): void;
}>();

// TODO: should be lineheight if no filter row or lineheight + filter row height. Maybe user-defined?
const theadStyle = {
  height: `${props.rowHeight * 2}px`,
  minHeight: `${props.rowHeight * 2}px`,
};

const theadContainerStyle = computed(() => {
  return {
    width: `${props.colWidths}px`,
    transform: `translateX(${-props.scrollLeft}px)`,
  };
});

const theadTrStyle = computed(() => {
  return {
    height: `${props.rowHeight}px`,
    width: `${props.colWidths}px`,
  };
});
</script>
