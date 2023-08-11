<template>
  <div
    ref="rootRef"
    :class="`vdt--root-wrapper ${tableBorderCls} ${extraClasses.table || ''}`"
    role="presentation"
  >
    <div v-if="resizableColumns" ref="resizerRef" class="vdt--resizer" />
    <div v-show="loading" class="vdt-loading">
      <slot name="loading">{{ loadingText }}</slot>
    </div>

    <div v-if="globalFilter" class="vdt-global-filter">
      <slot
        name="globalFilterInput"
        :filter-value="globalFilterValue"
        :update-filter="(val: any) => globalFilterValue = val"
      >
        <vdt-input
          v-model="globalFilterValue"
          style="width: 200px"
          class="vdt-global-filter-input"
        />
      </slot>
    </div>

    <div v-if="$slots.top || title" class="vdt-top">
      <slot name="top">
        <span v-if="title" class="vdt-top--title">{{ title }}</span>
      </slot>
    </div>

    <div class="vdt--root" :style="{ height: `${height}px` }">
      <div v-if="reorderableColumns">
        <div ref="dropColIndicatorDown" class="vdt--drop-indicator" :style="dropDownStyle">
          <svg-icon type="mdi" :path="mdiArrowDownBold" />
        </div>
        <div ref="dropColIndicatorUp" class="vdt--drop-indicator" :style="dropUpStyle">
          <svg-icon type="mdi" :path="mdiArrowUpBold" />
        </div>
      </div>

      <virtual-scroller
        v-slot="{ virtualRows, offsetY, tableHeight, spacerStyle }"
        :rows="processedRows"
        :columns="processedColumns"
        :root-height="height"
        :virtual-scroll-node-padding="virtualScrollNodePadding"
        :row-height="rowHeight"
        :col-widths="colWidths"
        :scroll-left="scrollLeft"
        :striped-rows="stripedRows"
        :expanded-row-height="expandedRowHeight[0] || 0"
        :rows-per-page="pagination.rowsPerPage || 0"
        :current-page="currentPage"
      >
        <table
          :aria-colcount="processedColumns.length"
          :aria-multiselectable="true"
          :aria-rowcount="rows.length"
          :class="[cellBorderCls, hoverCls, stripedCls, 'vdt--table']"
          :style="{ height: `${tableHeight}px`, minHeight: `${height}px`, width: `${colWidths}px` }"
        >
          <table-header
            :columns="processedColumns"
            :scroll-left="scrollLeft"
            :row-height="rowHeight"
            :resizable-columns="resizableColumns"
            :reorderable-columns="reorderableColumns"
            :sorters="sorters"
            :filters="filters"
            :selection="selection"
            :selected="selected"
            :total-row-count="rows.length"
            :class="extraClasses.thead"
            :extra-classes="extraClasses"
            :allow-select-all="allowSelectAll"
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
              <slot :name="slotName" v-bind="slotProps || {}" />
            </template>
          </table-header>

          <template v-if="virtualRows.length">
            <table-body
              :rows="virtualRows"
              :style="{ transform: `translate(0px,${offsetY}px)` }"
              :columns="processedColumns"
              :row-height="rowHeight"
              :col-widths="colWidths"
              :selection="selection"
              :selected="selectedByKey"
              :expanded-rows="expandedRows"
              :extra-classes="extraClasses"
              :row-key="rowKey"
              :handle-expand-icon="handleExpandIcon"
              @update-expanded-height="(h) => handleExpandedRowHeight(h, currentPage)"
              @update-selected="handleUpdateSelected"
              @update-expanded="updateExpanded"
              @on-cell-click="(e, col, row) => $emit('onCellClick', e, col, row)"
              @on-cell-dbl-click="(e, col, row) => $emit('onCellDblClick', e, col, row)"
              @on-row-click="(e, row) => $emit('onRowClick', e, row)"
              @on-row-dbl-click="(e, row) => $emit('onRowDblClick', e, row)"
            >
              <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                <slot :name="slotName" v-bind="slotProps || {}" />
              </template>
            </table-body>

            <tbody :style="{ height: `${spacerStyle}px` }" />
          </template>

          <template v-else>
            <tbody class="vdt-no-data">
              <tr>
                <td :colspan="processedColumns.length">
                  <slot name="noData">{{ noDataText }}</slot>
                </td>
              </tr>
            </tbody>
            <tbody :style="{ height: `${spacerStyle}px` }" />
          </template>
        </table>
      </virtual-scroller>
    </div>

    <div
      v-if="!hideTableBottom && ($slots.bottom || selection === 'multiple' || pagination)"
      class="vdt-bottom"
    >
      <slot name="bottom">
        <div>{{ selected.length }} selected</div>
      </slot>

      <div class="vdt-bottom-spacer" />

      <div class="vdt--pagination">
        <slot name="pagination">
          <table-paginator
            v-if="pagination"
            v-model:pagination="pagination"
            :current-page="currentPage"
            :total-page-num="totalPageNum"
            :total-row-count="processedRows.length"
            @update-page="updatePage"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { VRow, VColumn, VPagination, DataTableProps } from './types';
import TableHeader from './DataTable/TableHeader.vue';
import VirtualScroller from './DataTable/VirtualScroller.vue';
import TableBody from './DataTable/TableBody.vue';
import TablePaginator from './DataTable/TablePaginator.vue';
import useSorter from '../composables/useSorter';
import useFilter from '../composables/useFilter';
import useColResize from '../composables/useColResize';
import useColMove from '../composables/useColMove';
import useTableCls from '../composables/useTableCls';
import useRowSelect from '../composables/useRowSelect';
import useExpandedRows from '../composables/useExpandedRows';
import useSaveState from '../composables/useSaveState';
import VdtInput from './DataTable/VdtInput.vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowUpBold, mdiArrowDownBold } from '@mdi/js';

const props = withDefaults(defineProps<DataTableProps>(), {
  height: 600,
  rowHeight: 37,
  virtualScrollNodePadding: 10,
  borders: 'none',
  bordered: false,
  resizableColumns: false,
  reorderableColumns: false,
  highlightOnHover: false,
  stripedRows: false,
  globalFilter: false,
  loading: false,
  loadingText: 'Loading...',
  title: '',
  noDataText: 'No data found',
  selection: 'none',
  rowKey: '',
  hideTableBottom: false,
  stateKey: '',
  handleExpandIcon: false,
  allowSelectAll: true,
  defaultFilters: () => ({}),
  defaultSorters: () => [],
  extraClasses: () => {
    return { table: '', thead: '', headerRow: '', headerCell: '', tbody: '', row: '', cell: '' };
  },
  columnDefaults: () => {
    return {
      align: 'left',
      width: 150,
      resizable: true,
      sortable: true,
      filterable: true
    };
  }
});

const emit = defineEmits<{
  onCellClick: [event: MouseEvent, col: VColumn, row: VRow];
  onCellDblClick: [event: MouseEvent, col: VColumn, row: VRow];
  onRowClick: [event: MouseEvent, row: VRow];
  onRowDblClick: [event: MouseEvent, row: VRow];
  'update:selected': [newSelected: VRow[]];
}>();

const scrollLeft = ref(0);

const pagination = defineModel<VPagination>('pagination', { default: { rowsPerPage: 0 } });

// subtract 1 because the pages are 0-based
const currentPage = ref(pagination.value.initialPage - 1 || 0);
const totalPageNum = computed(
  () => Math.ceil(processedRows.value.length / pagination.value.rowsPerPage) - 1
);

function updatePage(page: number) {
  // ensure page does not go below 0 (page 1)
  // AND does not go past the total page num
  currentPage.value = page < 0 ? 0 : Math.min(page, totalPageNum.value);
}

const { expandedRows, expandedRowHeight, updateExpanded, handleExpandedRowHeight } =
  useExpandedRows(props);

const { selected, selectedByKey, updateSelected, onSelectAll } = useRowSelect(props);
function handleUpdateSelected(row: VRow) {
  const newSelected = updateSelected(row, props.selection);
  emit('update:selected', newSelected || []);
}

const { cellBorderCls, tableBorderCls, hoverCls, stripedCls } = useTableCls(props);

const { onColResizeStart, resizerRef, rootRef, widthChanged } = useColResize();
watch(widthChanged, (newChanged) => {
  if (
    scrollLeft.value !== 0 &&
    scrollLeft.value > colWidths.value - (rootRef.value?.clientWidth || 0)
  ) {
    scrollLeft.value = Math.max(0, scrollLeft.value + newChanged);
  }
});

const { sorters, updateSorters, sortRows, handleSortUpdate } = useSorter(props);
const { handleFilterRows, handleGlobalFilter, updateFilter, filters, globalFilterValue } =
  useFilter(props);

const processedColumns = ref(processColumns(props.columns));
watch(
  () => props.columns,
  (newCols) => (processedColumns.value = processColumns(newCols))
);

function processColumns(columns: VColumn[]): Required<VColumn>[] {
  const cols = columns.map((col, idx) => {
    if (col.sort) {
      handleSortUpdate(props.selection === 'multiple', col.field, sorters.value);
    }

    if (col.filter) {
      updateFilter(col.field, col.filter);
    }

    if (col.checkboxColumn || col.expandColumn) {
      // default for "non value" columns is center-align
      col.align = 'center';
      // no filter, sorting, resizing
      col.filterable = false;
      col.sortable = false;
      col.resizable = false;
    }

    const colId = col.colId
      ? col.colId
      : typeof col.field === 'string'
      ? col.field
      : `column-${idx}`;
    return Object.assign({ colId: colId }, props.columnDefaults, col) as Required<VColumn>;
  });
  return cols;
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
  onColDrop
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

const indexRows = (rows: VRow[]) => rows.map((r, idx) => ({ ...r, index: idx }));

const processedRows = computed<VRow[]>(() => {
  let rows = [...props.rows];
  rows = sortRows(sorters.value, rows);

  if (props.globalFilter) {
    rows = handleGlobalFilter(globalFilterValue.value, rows);
  } else {
    rows = handleFilterRows(filters.value, rows);
  }

  return indexRows(rows);
});

const colWidths = computed(() => {
  let width = 0;
  processedColumns.value.map((col: any) => (width += col.width || 150));
  return width;
});

// const { getState, saveState, loadState } = useSaveState();

// onMounted(() => {
//   const savedState = loadState(props.stateKey);
//   if (savedState) {
//     sorters.value = savedState.sorters;
//     filters.value = savedState.filters;

//     const newCols = savedState.columns.map((col) => {
//       const curCol = processedColumns.value.find((tmpCol) => tmpCol.colId === col.colId);
//       if (curCol) {
//         return Object.assign({}, curCol, col);
//       }
//     }) as Required<VColumn>[];

//     processedColumns.value = newCols;
//   }
// });

// watch(
//   [processedColumns, sorters, filters],
//   ([newCols, newSorters, newFilters]) => {
//     const newState = getState(newCols, newSorters, newFilters);
//     if (newState) saveState(props.stateKey, newState);
//   },
//   { deep: true }
// );
</script>

<style lang="scss">
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  width: 80vw;
}
.vdt--resizer {
  width: 1px;
  position: absolute;
  z-index: 10;
  top: 0px;
  display: none;
  border: 1px solid magenta;
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
.vdt--thead {
  position: sticky;
  z-index: 1;
  top: 0;
  left: 0;
  white-space: nowrap;
  background-color: var(--color-background);
}
.vdt--root {
  overflow: hidden;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}
.vdt--thead-tr {
  font-weight: 700;
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
.vdt--row-borders .vdt--cell,
.vdt--row-borders .vdt--th,
.vdt--expand-row {
  border-color: rgba(255, 255, 255, 0.6);
}
.vdt--th,
.vdt--cell {
  position: relative;
  padding: 5px;
}
.vdt--cell-borders.vdt--row-borders {
  .vdt--th,
  .vdt--cell {
    border-style: solid;
    border-width: 0 1px 1px 0;
  }
}
.vdt--row-borders .vdt--th,
.vdt--row-borders .vdt--cell,
.vdt--expand-row {
  border-style: solid;
  border-width: 0 0 1px 0;
}
.vdt--cell-borders {
  .vdt--th,
  .vdt--cell {
    border-style: solid;
    border-width: 0 1px 0 0;
  }
}
.vdt--th {
  overflow: hidden;
}
.vdt--th-extra {
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
.vdt--tbody {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  min-height: 0px;
}
.vdt--tbody-clipper {
  overflow: hidden;
  min-width: 0px;
  flex: 1 1 auto;
  height: 100%;
}
.vdt--row {
  transition: background-color 0.1s;
  white-space: nowrap;
}
.vdt--row-selected {
  background-color: rgba(255, 255, 255, 0.15) !important;
}
.vdt--cell,
.vdt--th,
.vdt--row-inner > * {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vdt--row-expanded {
  padding-left: 60px;
}
.vdt-no-data {
  padding: 10px;
}
.vdt-bottom {
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 5px 10px 10px 10px;
  display: flex;
  align-items: center;
}
.vdt-bottom-spacer {
  flex-grow: 1;
}
.vdt--table,
.vdt--thead,
.vdt--thead-tr,
.vdt--th,
.vdt--tbody-container,
.vdt--row,
.vdt--cell,
.vdt--root-paged {
  border-spacing: 0;
}
.vdt--table,
.vdt--thead,
.vdt--tbody-container,
.vdt--root-paged {
  table-layout: fixed;
}
</style>
