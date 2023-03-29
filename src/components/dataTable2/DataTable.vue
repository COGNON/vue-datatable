<template>
  <div
    ref="rootRef"
    :class="`vdt--root-wrapper ${tableBorderCls}`"
    role="presentation"
    :style="{ height: `${rootHeight}px` }"
  >
    <div v-if="loading" class="vdt-loading">
      <slot name="loading">{{ loadingText }}</slot>
    </div>

    <div v-if="resizableColumns" ref="resizerRef" class="vdt--resizer" />
    <div v-if="reorderableColumns" class="vdt--column-drop-wrapper" role="presentation">
      <div ref="dropColIndicatorDown" class="mdi mdi-arrow-down-bold vdt--drop-indicator" />
      <div ref="dropColIndicatorUp" class="mdi mdi-arrow-up-bold vdt--drop-indicator" />
    </div>

    <div v-if="globalFilter" class="vdt-global-filter">
      <slot
        name="globalFilterInput"
        :filter-value="globalFilterValue"
        :update-filter="(val: any) => globalFilterValue = val"
      >
        <q-input v-model="globalFilterValue" style="width: 200px" class="vdt-global-filter-input" dense outlined />
      </slot>
    </div>

    <div v-if="$slots.top || title" class="vdt-top">
      <slot name="top">
        <span v-if="title" class="vdt-top--title">{{ title }}</span>
      </slot>
    </div>

    <div class="vdt--root-wrapper-body" role="presentation">
      <div
        class="vdt--root"
        role="treegrid"
        :aria-colcount="processedColumns.length"
        :aria-multiselectable="true"
        :aria-rowcount="rows.length"
        :class="`${cellBorderCls} ${hoverCls} ${stripedCls}`"
      >
        <table-header
          :columns="processedColumns"
          :col-widths="colWidths"
          :scroll-left="scrollLeft"
          :row-height="rowHeight"
          :resizable-columns="resizableColumns"
          :reorderable-columns="reorderableColumns"
          :sorters="sorters"
          :filters="filters"
          @update-sorter="updateSorters"
          @update-filter="updateFilter"
          @on-resize-start="onColResizeStart"
          @on-drag-start="onColDragStart"
          @on-drag-end="onColDragEnd"
          @on-drag-over="onColDragOver"
          @on-drop="handleColDrop"
        >
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot v-if="String(slotName).startsWith('header')" :name="slotName" v-bind="slotProps || {}" />
          </template>
        </table-header>

        <virtual-scroller
          v-slot="{ virtualRows, startNode }"
          :rows="processedRows"
          :columns="processedColumns"
          :root-height="rootHeight"
          :virtual-scroll-node-padding="virtualScrollNodePadding"
          :row-height="rowHeight"
          :col-widths="colWidths"
          :scroll-left="scrollLeft"
          :striped-rows="stripedRows"
        >
          <table-body
            v-if="virtualRows.length"
            :rows="virtualRows"
            :columns="processedColumns"
            :row-height="rowHeight"
            :col-widths="colWidths"
            :virtual-start-node="startNode"
          >
            <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
              <slot v-if="String(slotName).startsWith('body')" :name="slotName" v-bind="slotProps || {}" />
            </template>
          </table-body>

          <div v-else class="vdt-no-data">
            <slot name="noData">{{ noDataText }}</slot>
          </div>
        </virtual-scroller>

        <!-- fake horizontal scroll -->
        <fake-horizontal-scroll
          :col-widths="colWidths"
          :client-width="rootRef?.clientWidth || 0"
          @update-scroll="(val) => (scrollLeft = val)"
        />
      </div>
    </div>

    <div v-if="$slots.bottom" class="vdt-bottom">
      <slot name="bottom">
        <!-- <div v-if="selectedRowsCount">{{ selectedRowsCount }} selected</div> -->
      </slot>

      <div class="vdt-bottom-spacer" />

      <!-- <div class="vdt-pagination">
        <slot name="pagination">
          <table-paginator
            v-if="pagination"
            :current-page="currentPage"
            :total-page-num="processedRows.length"
            :rows-per-page="pagination"
            :total-row-count="totalRowCount"
            @update-page="(newPage) => (currentPage = newPage)"
          />
        </slot>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { VColumn, VFilter, VSorter } from '../DataTable/types';
import TableHeader from './TableHeader.vue';
import FakeHorizontalScroll from './FakeHorizontalScroll.vue';
import VirtualScroller from './VirtualScroller.vue';
import TableBody from './TableBody.vue';
import useSorter from 'src/composables/useSorter';
import useFilter from 'src/composables/useFilter';
import useColResize from 'src/composables/useColResize';
import useColMove from 'src/composables/useColMove';
import useTableCls from 'src/composables/useTableCls';
import { getColIdx } from '../utils';

interface Props {
  columns: VColumn[];
  rows: any[];
  rootHeight?: number;
  rowHeight?: number;
  virtualScrollNodePadding?: number;
  borders?: 'cell' | 'row' | 'both' | 'none';
  bordered?: boolean;
  resizableColumns?: boolean;
  reorderableColumns?: boolean;
  hightlightOnHover?: boolean;
  stripedRows?: boolean;
  globalFilter?: boolean;
  defaultFilters?: VFilter;
  defaultSorters?: VSorter[];
  loading?: boolean;
  loadingText?: string;
  title?: string;
  noDataText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  rootHeight: 600,
  rowHeight: 28,
  virtualScrollNodePadding: 20,
  borders: 'none',
  bordered: false,
  resizableColumns: false,
  reorderableColumns: false,
  hightlightOnHover: false,
  stripedRows: false,
  globalFilter: false,
  loading: false,
  loadingText: 'Loading...',
  title: '',
  noDataText: 'No data found',
  defaultFilters: () => {
    return {};
  },
  defaultSorters: () => [],
});

const { cellBorderCls, tableBorderCls, hoverCls, stripedCls } = useTableCls(props);
const { onColResizeStart, resizerRef, rootRef, updatedCol } = useColResize();
watch(updatedCol, (col) => {
  if (col) {
    const colIdx = getColIdx(processedColumns.value, col.name);
    if (colIdx !== -1) processedColumns.value[colIdx] = col;
  }
});

const processedColumns = ref(processColumns(props.columns));
watch(
  () => props.columns,
  (newCols) => (processedColumns.value = processColumns(newCols))
);

function processColumns(columns: VColumn[]) {
  return columns;
}

const { dropColIndicatorDown, dropColIndicatorUp, onColDragStart, onColDragOver, onColDragEnd, onColDrop } =
  useColMove();
function handleColDrop(e: DragEvent) {
  processedColumns.value = onColDrop(e, processedColumns.value);
}

const globalFilterValue = ref('');
function filterGlobally(filter: string, rows: any[]): any[] {
  if (!filter) return props.rows;
  return handleGlobalFilter(filter, rows);
}

const filters = ref<VFilter>(props.defaultFilters);
watch(
  () => props.defaultFilters,
  (newFilters) => (filters.value = newFilters)
);

function updateFilter(field: string, val: any) {
  if (val) filters.value[field] = String(val);
  else delete filters.value[field];
}

const sorters = ref<VSorter[]>(props.defaultSorters);
watch(
  () => props.defaultSorters,
  (newSorters) => (sorters.value = newSorters)
);

const { sortRows, handleSortUpdate } = useSorter();

const processedRows = computed(() => {
  let rows = props.rows;
  rows = sortRows(sorters.value, rows);

  if (props.globalFilter) {
    rows = filterGlobally(globalFilterValue.value, rows);
  } else {
    rows = filterRows(filters.value, rows);
  }

  return rows;
});

function updateSorters(e: MouseEvent, field: string): void {
  sorters.value = handleSortUpdate(e.ctrlKey, field, sorters.value);
}

const { handleFilterRows, handleGlobalFilter } = useFilter();

function filterRows(filters: VFilter, rows: any[]): any[] {
  // no filters, return original rows
  if (!Object.keys(filters).length) return props.rows;
  return handleFilterRows(filters, rows);
}

const colWidths = computed(() => {
  let width = 0;
  processedColumns.value.map((col: any) => (width += col.width || 150));
  return width;
});

const scrollLeft = ref(0);
</script>

<style>
.vdt-loading {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}
.vdt-global-filter-input {
  padding: 5px;
}
.vdt--clickable {
  cursor: pointer;
}
.vdt--table-border {
  border: 1px solid rgba(255, 255, 255, 0.8);
}
.vdt--root-wrapper {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.vdt--resizer {
  width: 1px;
  position: absolute;
  z-index: 10;
  top: 0px;
  display: none;
  border: 1px solid var(--q-accent);
}
.vdt--column-drop-wrapper {
  display: flex;
}
.vdt--drop-indicator {
  position: absolute;
  display: none;
  font-size: 2rem;
  z-index: 100;
}
.vdt-top {
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  padding: 10px 10px 5px 10px;
}
.vdt-top--title {
  font-size: 1.5em;
}
.vdt--root-wrapper-body {
  flex: 1 1 auto;
  height: 0;
  min-height: 0;
  display: flex;
  flex-direction: row;
}
.vdt--root {
  height: 100%;
  overflow: hidden;
  flex: 1 1 auto;
  width: 0;
  position: relative;
  display: flex;
  flex-direction: column;
}
.vdt--thead-wrapper {
  flex-direction: row;
  background-color: var(--q-dark);
  display: flex;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}
.vdt--thead {
  position: relative;
  height: 100%;
  min-width: 0px;
  overflow: hidden;
  flex: 1 1 auto;
}
.vdt--thead-container {
  position: relative;
  height: 100%;
  white-space: nowrap;
}
.vdt--thead-tr {
  font-weight: 700;
  overflow: hidden;
}
.vdt--thead-filters {
  overflow: hidden;
}
.vdt--row-highlight .vdt--row:hover {
  background-color: rgba(255, 255, 255, 0.4);
}
.vdt--striped-rows .vdt--row-odd {
  background-color: rgba(255, 255, 255, 0.1);
}
.vdt--cell-borders .vdt--th,
.vdt--cell-borders .vdt--cell,
.vdt--cell-borders .vdt--row > * {
  border-right: 1px solid rgba(255, 255, 255, 0.6);
}
.vdt--row-borders .vdt--row,
.vdt--thead-wrapper {
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
}
.vdt--th {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
}
.vdt--th-filter {
  padding: 5px;
}
.vdt--th-resizer {
  display: block;
  position: absolute !important;
  top: 0;
  right: 0;
  margin: 0;
  width: 0.5rem;
  height: 100%;
  padding: 0px;
  cursor: col-resize;
  border: 1px solid transparent;
}
.vdt--th-cell-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
}
.vdt--th-label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 5px;
}
.vdt--th-label {
  display: flex;
  flex: 1 1 auto;
  overflow: hidden;
  align-items: center;
  text-overflow: ellipsis;
}
.vdt--th-label-text {
  overflow: hidden;
  text-overflow: ellipsis;
}
.vdt--tbody {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  min-height: 0;
}
.vdt--tbody-clipper {
  overflow: hidden;
  min-width: 0px;
  flex: 1 1 auto;
  height: 100%;
}
.vdt--tbody-viewport {
  flex-direction: row;
  position: relative;
  height: 100%;
  width: calc(100% + 15px);
  min-width: 0px;
  overflow: hidden;
  overflow-y: auto;
  flex: 1 1 auto;
}
.vdt--tbody-container {
  display: block;
  position: relative;
}
.vdt--row {
  transition: background-color 0.1s;
  white-space: nowrap;
  width: 100%;
}
.vdt--cell,
.vdt--row > * {
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  white-space: nowrap;
  height: 100%;
  padding: 5px;
}
.vdt--row-expanded {
  padding-left: 60px;
}
.vdt--tbody-hscroll {
  height: 100%;
  min-height: 0;
  min-width: 0;
  display: flex;
  position: relative;
}
.vdt--tbody-vscroll-viewport {
  position: relative;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  flex: 1 1 auto;
}
.vdt--tbody-vscroll-container {
  width: 100%;
  position: relative;
}
.vdt--tbody-hscroll {
  flex-direction: row;
  width: 100%;
}
.vdt--tbody-hscroll-lspacer,
.vdt--tbody-hscroll-rspacer {
  height: 100%;
  min-width: 0;
  overflow-x: hidden;
}
.vdt--tbody-hscroll-viewport {
  position: relative;
  height: 100%;
  min-width: 0px;
  overflow: hidden;
  overflow-x: scroll;
  flex: 1 1 auto;
}
.vdt--tbody-hscroll-container {
  height: 100%;
  position: relative;
}
.vdt-no-data {
  padding: 10px;
}
.vdt-bottom {
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 5px 10px 10px 10px;
  display: flex;
}
.vdt-bottom-spacer {
  flex-grow: 1;
}
</style>
