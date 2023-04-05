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
      <div ref="dropColIndicatorDown" class="mdi mdi-arrow-down-bold vdt--drop-indicator" :style="dropDownStyle" />
      <div ref="dropColIndicatorUp" class="mdi mdi-arrow-up-bold vdt--drop-indicator" :style="dropUpStyle" />
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

    <div v-else class="vdt--root-wrapper-body" role="presentation">
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
          :style="{ width: `${colWidths}px` }"
          :selection="selection"
          :selected="selected"
          :total-row-count="rows.length"
          :class="pagination ? 'vdt--thead-pagination' : ''"
          @update-sorter="updateSorters"
          @update-filter="updateFilter"
          @on-resize-start="onColResizeStart"
          @on-drag-start="onColDragStart"
          @on-drag-end="onColDragEnd"
          @on-drag-over="onColDragOver"
          @on-drop="handleColDrop"
          @select-all="onSelectAll"
        >
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot
              v-if="String(slotName).startsWith('header') || String(slotName).startsWith('expanded')"
              :name="slotName"
              v-bind="slotProps || {}"
            />
          </template>
        </table-header>

        <paged-table
          v-if="pagination.rowsPerPage && processedRows.length"
          v-slot="{ pagedRows }"
          :rows="processedRows"
          :columns="processedColumns"
          :row-height="rowHeight"
          :col-widths="colWidths"
          :root-height="rootHeight"
          :scroll-left="scrollLeft"
          :expanded-row-height="expandedRowHeightPerPage[currentPage] || 0"
          :pagination="pagination"
          :current-page="currentPage"
        >
          <table-body
            v-if="processedRows.length"
            :rows="pagedRows"
            :columns="processedColumns"
            :row-height="rowHeight"
            :col-widths="colWidths"
            :selection="selection"
            :selected="selectedByKey"
            :row-key="rowKey"
            @update-expanded-height="handleExpandedRowHeightPaged"
            @update-selected="updateSelected"
          >
            <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
              <slot
                v-if="String(slotName).startsWith('body') || String(slotName).startsWith('expanded')"
                :name="slotName"
                v-bind="slotProps || {}"
              />
            </template>
          </table-body>
        </paged-table>

        <virtual-scroller
          v-else
          v-slot="{ virtualRows, startNode }"
          :rows="processedRows"
          :columns="processedColumns"
          :root-height="rootHeight"
          :virtual-scroll-node-padding="virtualScrollNodePadding"
          :row-height="rowHeight"
          :col-widths="colWidths"
          :scroll-left="scrollLeft"
          :striped-rows="stripedRows"
          :expanded-row-height="expandedRowHeight"
        >
          <table-body
            v-if="virtualRows.length"
            :rows="virtualRows"
            :columns="processedColumns"
            :row-height="rowHeight"
            :col-widths="colWidths"
            :virtual-start-node="startNode"
            :selection="selection"
            :selected="selectedByKey"
            :row-key="rowKey"
            @update-expanded-height="(val) => (expandedRowHeight += val)"
            @update-selected="updateSelected"
          >
            <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
              <slot
                v-if="String(slotName).startsWith('body') || String(slotName).startsWith('expanded')"
                :name="slotName"
                v-bind="slotProps || {}"
              />
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

    <div
      v-if="!hideTableBottom && ($slots.bottom || selection === 'multiple' || pagination.rowsPerPage)"
      class="vdt-bottom"
    >
      <slot name="bottom">
        <div>{{ selected.length }} selected</div>
      </slot>

      <div class="vdt-bottom-spacer" />

      <div class="vdt--pagination">
        <slot name="pagination">
          <table-paginator
            v-if="pagination.rowsPerPage"
            :current-page="currentPage"
            :total-page-num="processedRows.length"
            :pagination="pagination"
            :total-row-count="totalRowCount"
            @update-page="(newPage) => (currentPage = newPage)"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { VColumn, VFilter, VSorter, VSelectionModes, VCellSeparators, VPagination } from '../types';
import TableHeader from './TableHeader.vue';
import FakeHorizontalScroll from './FakeHorizontalScroll.vue';
import VirtualScroller from './VirtualScroller.vue';
import PagedTable from './PagedTable.vue';
import TableBody from './TableBody.vue';
import TablePaginator from './TablePaginator.vue';
import useSorter from 'src/composables/useSorter';
import useFilter from 'src/composables/useFilter';
import useColResize from 'src/composables/useColResize';
import useColMove from 'src/composables/useColMove';
import useTableCls from 'src/composables/useTableCls';
import useRowSelect from 'src/composables/useRowSelect';
import usePagination from 'src/composables/usePagination';

interface Props {
  columns: VColumn[];
  rows: any[];
  rootHeight?: number;
  rowHeight?: number;
  virtualScrollNodePadding?: number;
  borders?: VCellSeparators;
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
  selection?: VSelectionModes;
  rowKey?: string;
  pagination?: VPagination;
  hideTableBottom?: boolean;
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
  selection: 'none',
  rowKey: '',
  hideTableBottom: false,
  pagination: () => {
    return { rowsPerPage: 0 };
  },
  defaultFilters: () => {
    return {};
  },
  defaultSorters: () => [],
});

const scrollLeft = ref(0);
const expandedRowHeight = ref(0);

const expandedRowHeightPerPage = ref<number[]>([]);
function handleExpandedRowHeightPaged(height: number) {
  if (!expandedRowHeightPerPage.value[currentPage.value]) {
    expandedRowHeightPerPage.value[currentPage.value] = Math.max(height, 0);
  } else {
    expandedRowHeightPerPage.value[currentPage.value] += height;
  }
}

const { currentPage, totalRowCount, pageRows } = usePagination(props);
const { selected, selectedByKey, updateSelected, onSelectAll } = useRowSelect(props);
const { cellBorderCls, tableBorderCls, hoverCls, stripedCls } = useTableCls(props);

const { onColResizeStart, resizerRef, rootRef, widthChanged } = useColResize();
watch(widthChanged, (newChanged) => {
  if (scrollLeft.value !== 0 && scrollLeft.value > colWidths.value - (rootRef.value?.clientWidth || 0)) {
    scrollLeft.value = Math.max(0, scrollLeft.value + newChanged);
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

const {
  dropColIndicatorDown,
  dropColIndicatorUp,
  iconDownTop,
  iconUpTop,
  iconYLocation,
  onColDragStart,
  onColDragOver,
  onColDragEnd,
  onColDrop,
} = useColMove();

function handleColDrop(e: DragEvent) {
  processedColumns.value = onColDrop(e, processedColumns.value);
}

// use scrollleft to adjust the icon position based on horizontal scroll
const dropDownStyle = computed(() => {
  return { top: `${iconDownTop.value}px`, left: `${iconYLocation.value - scrollLeft.value}px` };
});

const dropUpStyle = computed(() => {
  return { top: `${iconUpTop.value}px`, left: `${iconYLocation.value - scrollLeft.value}px` };
});

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

  if (props.pagination.rowsPerPage !== 0) rows = pageRows(rows);

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
</script>

<style>
.vdt--clickable {
  cursor: pointer;
}
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
.vdt-global-filter-input,
.vdt--th-filter {
  padding: 5px;
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
.vdt--root,
.vdt--thead,
.vdt--thead-container,
.vdt--tbody-hscroll-container,
.vdt--tbody-hscroll-viewport {
  position: relative;
  height: 100%;
}
.vdt--thead-pagination {
  height: auto;
}
.vdt--root {
  overflow: hidden;
  flex: 1 1 auto;
  width: 0;
  display: flex;
  flex-direction: column;
}
.vdt--thead-container {
  white-space: nowrap;
}
.vdt--thead-tr {
  font-weight: 700;
  display: flex;
}
.vdt--thead-filters,
.vdt--thead-tr {
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
.vdt--row-expanded {
  border-right: 1px solid rgba(255, 255, 255, 0.6);
}
.vdt--row-borders .vdt--row,
.vdt--thead-wrapper,
.vdt--thead-tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
}
.vdt--th,
.vdt--cell {
  position: relative;
  padding: 5px;
}
.vdt--th {
  overflow: hidden;
}
.vdt--th-extra,
.vdt--cell-extra {
  width: 60px;
  text-align: center;
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
.vdt--th-label,
.vdt--th-label-text {
  overflow: hidden;
  text-overflow: ellipsis;
}
.vdt--th-label {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
}
.vdt--tbody {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  min-height: 0px;
}
.vdt--tbody-clipper,
.vdt--tbody-viewport {
  overflow: hidden;
  min-width: 0px;
  flex: 1 1 auto;
  height: 100%;
}
.vdt--tbody-viewport {
  flex-direction: row;
  position: relative;
  width: calc(100% + 15px);
  overflow-y: auto;
}
.vdt--row {
  transition: background-color 0.1s;
  white-space: nowrap;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.vdt--row-selected {
  background-color: rgba(255, 255, 255, 0.15);
}
.vdt--row-inner {
  display: flex;
}
.vdt--cell,
.vdt--th,
.vdt--row-inner > * {
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  white-space: nowrap;
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
.vdt--tbody-vscroll-container,
.vdt--tbody-container {
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
  min-width: 0px;
  overflow: hidden;
  overflow-x: scroll;
  flex: 1 1 auto;
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
.vdt--thead,
.vdt--thead-tr,
.vdt--th,
.vdt--tbody-container,
.vdt--row,
.vdt--cell,
.vdt--root-paged {
  border-collapse: collapse;
}
.vdt--thead,
.vdt--tbody-container,
.vdt--root-paged {
  table-layout: fixed;
}
</style>
