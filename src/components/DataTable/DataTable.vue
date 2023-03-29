<template>
  <div class="vdt-container">
    <div v-if="loading" class="vdt-loading">
      <slot name="loading">{{ loadingText }}</slot>
    </div>

    <div v-if="filterGlobal" class="vdt-global-filter">
      <q-input
        v-model="globalFilter"
        style="width: 200px"
        class="vdt-global-filter-input"
        v-bind="filterComponentProps"
      />
    </div>

    <div v-if="$slots.top || title" class="vdt-top">
      <slot name="top">
        <span v-if="title" class="vdt-top--title">{{ title }}</span>
      </slot>
    </div>

    <div
      v-if="pagination !== 0"
      class="vdt-table"
      role="tablegrid"
      :aria-colcount="columns.length"
      :aria-rowcount="pagination ? totalRowCount : processedRows.length"
      :style="{ overflow: 'auto', height: height + 'px' }"
    >
      <table-header
        :columns="columns"
        :row-separator-cls="rowSeparatorCls"
        :col-separator-cls="colSeparatorCls"
        :sorters="sorters"
        :reorderable-columns="reorderableColumns"
        :resizable-columns="resizableColumns"
        :selection="selection"
        :selected-rows="selectedRows"
        :row-number="processedRows.length"
        @update-sorter="updateSorters"
        @on-resize-start="onColResizeStart"
        @on-drag-start="onColDragStart"
        @on-drag-end="onColDragEnd"
        @on-drag-over="onColDragOver"
        @on-drop="onColDrop"
        @on-select-all="onSelectAll"
      >
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot v-if="$slots[name]" :name="name" v-bind="slotData" />
        </template>

        <template v-if="filterHeader" #filter="colProps">
          <q-input v-model="filters[colProps.col.field]" class="vdt-hdr-filter" v-bind="filterComponentProps" />
        </template>
      </table-header>

      <table-body
        v-if="processedRows.length"
        :rows="processedRows[currentPage]"
        :line-height="lineHeight"
        :columns="columns"
        :row-separator-cls="rowSeparatorCls"
        :col-separator-cls="colSeparatorCls"
        :hightlight-on-hover="hightlightOnHover"
        :striped-rows="stripedRows"
        :selection="selection"
        :all-selected="allSelected"
        :selected-rows="selectedRows"
        :wrap-cells="wrapCells"
        @on-row-select="onRowSelect"
      >
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot v-if="$slots[name]" :name="name" v-bind="slotData" />
        </template>
      </table-body>
    </div>

    <virtual-scroller
      v-else
      ref="rootRef"
      class="vdt-table"
      role="table"
      :rows="processedRows"
      :columns="columns"
      :line-height="lineHeight"
      :root-height="height"
      :virtual-scroll-node-padding="virtualScrollNodePadding"
    >
      <template #before>
        <table-header
          :columns="columns"
          :row-separator-cls="rowSeparatorCls"
          :col-separator-cls="colSeparatorCls"
          :sorters="sorters"
          :reorderable-columns="reorderableColumns"
          :resizable-columns="resizableColumns"
          :selection="selection"
          :selected-rows="selectedRows"
          :row-number="processedRows.length"
          @update-sorter="updateSorters"
          @on-resize-start="onColResizeStart"
          @on-drag-start="onColDragStart"
          @on-drag-end="onColDragEnd"
          @on-drag-over="onColDragOver"
          @on-drop="onColDrop"
          @on-select-all="onSelectAll"
        >
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot v-if="$slots[name]" :name="name" v-bind="slotData" />
          </template>

          <template v-if="filterHeader" #filter="colProps">
            <q-input v-model="filters[colProps.col.field]" class="vdt-hdr-filter" v-bind="filterComponentProps" />
          </template>
        </table-header>
      </template>

      <template #content="scrollerProps">
        <table-body
          v-if="processedRows.length"
          :rows="scrollerProps.visibleRows"
          :line-height="lineHeight"
          :columns="columns"
          :row-separator-cls="rowSeparatorCls"
          :col-separator-cls="colSeparatorCls"
          :hightlight-on-hover="hightlightOnHover"
          :striped-rows="stripedRows"
          :selection="selection"
          :all-selected="allSelected"
          :selected-rows="selectedRows"
          :wrap-cells="wrapCells"
          @on-row-select="onRowSelect"
        >
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot v-if="$slots[name]" :name="name" v-bind="slotData" />
          </template>
        </table-body>

        <div v-else class="vdt-no-data">
          <slot name="noData">{{ noDataText }}</slot>
        </div>
      </template>
    </virtual-scroller>

    <div v-if="$slots.bottom || selectedRowsCount || pagination" class="vdt-bottom">
      <slot name="bottom">
        <div v-if="selectedRowsCount">{{ selectedRowsCount }} selected</div>
      </slot>

      <div class="vdt-bottom-spacer" />

      <div class="vdt-pagination">
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
      </div>
    </div>

    <div v-if="resizableColumns" ref="resizerRef" class="vdt--resizer"></div>
    <template v-if="reorderableColumns">
      <div ref="dropColIndicatorDown" class="mdi mdi-arrow-down-bold vdt--drop-indicator" />
      <div ref="dropColIndicatorUp" class="mdi mdi-arrow-up-bold vdt--drop-indicator" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { VColumn, VFilter, CellSeparators, VSorter, SelectionModes, SelectedRow, CellWrap } from './types';
import { computed, ref, watch } from 'vue';
import TableHeader from './TableHeader.vue';
import TableBody from './TableBody.vue';
import VirtualScroller from './VirtualScroller.vue';
import FilterComponent from './FilterComponent.vue';
import { QInputProps } from 'quasar';
import TablePaginator from './TablePaginator.vue';
import useColResize from 'src/composables/useColResize';

const { onColResizeStart, resizerRef, rootRef, updatedCol } = useColResize();
watch(updatedCol, (col) => {
  if (col) {
    const colIdx = getColIdx(col.name);
    if (colIdx !== -1) columns.value[colIdx] = col;
  }
});

const dropColIndicatorDown = ref<HTMLElement | undefined>();
const dropColIndicatorUp = ref<HTMLElement | undefined>();

interface VGridProps {
  rows: any[];
  columns: VColumn[];
  filterGlobal?: boolean;
  filterHeader?: boolean;
  separators?: CellSeparators;
  reorderableColumns: boolean;
  resizableColumns: boolean;
  hightlightOnHover?: boolean;
  stripedRows?: boolean;
  defaultFilters?: VFilter;
  defaultSorters?: VSorter;
  defaultColProps?: Partial<VColumn>;
  title?: string;
  lineHeight?: number;
  selection?: SelectionModes;
  wrapCells?: CellWrap;
  loading?: boolean;
  loadingText?: string;
  noDataText?: string;
  height?: number;
  virtualScrollNodePadding?: number;
  pagination?: number;
}

const props = withDefaults(defineProps<VGridProps>(), {
  rows: () => [],
  filters: false,
  filterHeader: false,
  separators: 'none',
  filterComponent: FilterComponent,
  filterComponentProps: {},
  reorderableColumns: false,
  resizableColumns: false,
  hightlightOnHover: false,
  stripedRows: false,
  title: '',
  lineHeight: 30,
  selection: 'none',
  wrapCells: 'none',
  loading: false,
  loadingText: 'Loading...',
  noDataText: 'No data found',
  height: 400,
  virtualScrollNodePadding: 20,
  pagination: 0,
  defaultFilters: () => {
    return {};
  },
  defaultSorters: () => {
    return {};
  },
  defaultColProps: () => {
    return {
      sortable: true,
      filterable: true,
    };
  },
});

const currentPage = ref(0);
const totalRowCount = ref(0);

const columns = ref(getFinalColumns(props.columns));
watch(
  () => props.columns,
  (newCols) => (columns.value = getFinalColumns(newCols))
);
function getFinalColumns(columns: VColumn[]): VColumn[] {
  return columns.map((col) => Object.assign({}, props.defaultColProps, col));
}

const sorters = ref<VSorter>(props.defaultSorters);

const filters = ref<VFilter>(props.defaultFilters);
const filterComponentProps: Partial<QInputProps> = {
  dense: true,
  filled: true,
  label: 'Search',
};

function filterRows(filters: VFilter | string, rows: any[]): any[] {
  if (typeof filters === 'string' && filters) {
    // global filter
    return rows.filter((row) => {
      return Object.values(row).some((value) => {
        return String(value).toLowerCase().includes(filters.toLowerCase());
      });
    });
  }

  // no filters, return original rows
  if (!Object.keys(filters).length) return props.rows;

  return rows.filter((row) => {
    return Object.keys(filters).every((field) => {
      if (!filters[field]) {
        delete filters[field];
        return true;
      }
      return row[field] ? row[field].toLowerCase().includes(filters[field].toLowerCase()) : false;
    });
  });
}

const processedRows = ref(processRows(props.rows));
watch(
  () => props.rows,
  (newRows) => (processedRows.value = processRows(newRows))
);

watch(
  () => props.pagination,
  () => (processedRows.value = processRows(props.rows))
);

const allSelected = ref(false);
const selectedRows = ref<SelectedRow>({});
function onSelectAll(val: boolean) {
  allSelected.value = val;

  // actually (de)select all
  for (let i = 0; i < processedRows.value.length; i++) {
    if (val) selectedRows.value[i] = val;
    else delete selectedRows.value[i];
  }
}

function onRowSelect(rowIdx: number, selected: boolean) {
  if (selected) selectedRows.value[rowIdx] = selected;
  else delete selectedRows.value[rowIdx];

  if (props.selection === 'single') {
    // deselect all others
    const rowsSelected = Object.keys(selectedRows.value);
    if (rowsSelected.length > 1) {
      rowsSelected.forEach((idx: number) => {
        if (idx != rowIdx) delete selectedRows.value[idx];
      });
    }
  }
}

const selectedRowsCount = computed(() => Object.keys(selectedRows.value).length);
const rowSeparatorCls = computed<string>(() => (props.separators.match(/row|cell/) ? 'vdt-row--separators' : ''));
const colSeparatorCls = computed<string>(() => (props.separators.match(/column|cell/) ? 'vdt-col--separators' : ''));

watch(filters, (newFilters) => (processedRows.value = processRows(filterRows(newFilters, props.rows))), {
  deep: true,
});

const globalFilter = ref();
watch(globalFilter, (newFilter) => {
  // use the original rows. if user backspaces from no rows filtered, it will still return no rows
  processedRows.value = processRows(filterRows(newFilter, props.rows));
});

watch(sorters, () => (processedRows.value = processRows(sortRows(processedRows.value))), {
  deep: true,
});

function updateSorters(e: MouseEvent, field: string): void {
  if (e.ctrlKey) {
    // multi-sort key
    if (!sorters.value[field]) {
      // sorter doesn't exist, add to end
      const curSortersNum = Object.keys(sorters.value).length;

      sorters.value[field] = {
        field: field,
        dir: 'asc',
        num: curSortersNum + 1,
      };
    } else {
      // check direction
      if (sorters.value[field]['dir'] === 'asc') {
        // swap to des
        sorters.value[field]['dir'] = 'des';
      } else {
        // remove sorter
        delete sorters.value[field];
      }
    }
  } else {
    // check if current sorter is this field
    if (!sorters.value[field]) {
      // not current sorter, clear sorters & readd
      sorters.value = {
        [field]: {
          field: field,
          dir: 'asc',
          num: 1,
        },
      };
    } else {
      // current sorter, check direction
      if (sorters.value[field]['dir'] === 'asc') {
        // swap to des
        sorters.value[field]['dir'] = 'des';
      } else {
        // remove sorter
        delete sorters.value[field];
      }
    }
  }
}

function sortRows(rows: any[]): any[] {
  if (!Object.keys(sorters.value).length) return rows;

  // sort by num in order, then convert fields into an array
  // descending fields are prepended with a '-'
  const fields = Object.values(sorters.value)
    .sort((a, b) => a.num - b.num)
    .map((sorter) => (sorter.dir === 'des' ? `-${sorter.field}` : sorter.field));

  return rows.sort(multiSort(fields));
}

function multiSort(fields: string[]) {
  const dir: number[] = [];
  const len = fields.length;

  fields = fields.map((o, i) => {
    if (o[0] === '-') {
      dir[i] = -1;
      o = o.substring(1);
    } else {
      dir[i] = 1;
    }
    return o;
  });

  return (a: any, b: any): number => {
    for (let i = 0; i < len; i++) {
      const o = fields[i];
      if (a[o] > b[o]) return dir[i];
      if (a[o] < b[o]) return -dir[i];
    }
    return 0;
  };
}

function pageRows(rows: any[]): any[] {
  if (props.pagination === 0) return rows;
  totalRowCount.value = 0;
  let pagedRows: any[] = [];
  for (let i = 0; i < rows.length; i += props.pagination) {
    const sliced = rows.slice(i, i + props.pagination);
    totalRowCount.value += sliced.length;
    pagedRows.push(sliced);
  }
  return pagedRows;
}

function processRows(rows: any[]): any[] {
  return pageRows(sortRows(filterRows(filters.value, rows)));
}

// const resizingCol = ref(false);
// let curColEl: HTMLElement | null = null;
// let curColResizing: VColumn | null = null;

// let x = 0;
// let diffX = 0;

// function onColResizeStart(e: MouseEvent, col: VColumn) {
//   if (!rootRef.value || resizingCol.value) return;
//   e.preventDefault();

//   resizingCol.value = true;
//   x = e.clientX;
//   curColResizing = col;
//   curColEl = (e.target as HTMLElement).parentElement;

//   document.addEventListener('mousemove', onColResizeMove);
//   document.addEventListener('mouseup', onColResizeEnd);
// }

// const onColResizeMove = (e: MouseEvent) => {
//   if (!(rootRef.value && resizerRef.value)) return;
//   e.preventDefault();

//   diffX = e.clientX - x;

//   resizerRef.value.setAttribute(
//     'style',
//     `top: ${rootRef.value.offsetTop}px; height: ${rootRef.value.clientHeight}px; left: ${e.pageX}px; display:block;`
//   );
// };

// const onColResizeEnd = () => {
//   if (!(curColResizing && resizerRef.value && curColEl)) return;

//   resizingCol.value = false;

//   const colIdx = getColIdx(curColResizing.field);

//   if (colIdx > -1) {
//     columns.value[colIdx].width = curColEl.offsetWidth + diffX;
//   }

//   resizerRef.value.style.display = 'none';

//   document.removeEventListener('mousemove', onColResizeMove);
//   document.removeEventListener('mouseup', onColResizeEnd);
// };

function onColDragStart(e: DragEvent) {
  const sourceCol = e.target as HTMLElement;
  sourceCol.style.opacity = '0.4';
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text', sourceCol.getAttribute('field') as string);
  }
}

function onColDrop(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();

  const targetCol = getClosestColEl(e.target as HTMLElement);
  if (!targetCol) return;

  const data = e.dataTransfer?.getData('text');
  const [srcField] = data?.split('~~');

  const destField = targetCol.getAttribute('field');

  if (!(srcField && destField)) return;

  if (srcField !== destField) {
    const srcColIdx = getColIdx(srcField);
    const sourceCol = columns.value.splice(srcColIdx, 1);
    const destColIdx = getColIdx(destField);

    const colCenter = targetCol.offsetLeft + targetCol.offsetWidth / 2;

    if (colCenter < e.clientX) {
      // move after
      columns.value.splice(destColIdx + 1, 0, sourceCol[0]);
    } else {
      columns.value.splice(destColIdx, 0, sourceCol[0]);
    }
  }

  return;
}

function onColDragEnd(e: DragEvent) {
  (e.target as HTMLElement).style.opacity = '1';

  if (!(dropColIndicatorDown.value && dropColIndicatorUp.value)) return;
  dropColIndicatorDown.value.style.display = 'none';
  dropColIndicatorUp.value.style.display = 'none';
}

function onColDragOver(e: DragEvent) {
  // fires off the element being hovered over
  e.preventDefault(); // allows dropping

  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

  if (!(dropColIndicatorDown.value && dropColIndicatorUp.value)) return;

  const targetCol = getClosestColEl(e.target as HTMLElement);
  if (!targetCol) return;

  const { top, left } = getOffset(targetCol);
  const colWidth = targetCol.offsetWidth;
  const colCenter = left + colWidth / 2;
  const colHeight = targetCol.clientHeight;

  const iconHeight = dropColIndicatorDown.value.clientHeight / 2;
  const iconWidth = dropColIndicatorDown.value.clientWidth / 2;

  const iconLeftLocation = left - iconWidth + 'px';
  const iconRightLocation = left + colWidth - iconWidth + 'px';
  const iconDownTop = top - iconHeight;
  const iconUpTop = top + colHeight - iconHeight;

  if (colCenter < e.clientX) {
    // place indicators to right of targetCol
    dropColIndicatorDown.value.setAttribute('style', `top: ${iconDownTop}px;left:${iconRightLocation}`);
    dropColIndicatorUp.value.setAttribute('style', `top: ${iconUpTop}px;left:${iconRightLocation}`);
  } else {
    // place indicators to left of targetCol
    dropColIndicatorDown.value.setAttribute('style', `top: ${iconDownTop}px;left:${iconLeftLocation}`);
    dropColIndicatorUp.value.setAttribute('style', `top: ${iconUpTop}px;left:${iconLeftLocation}`);
  }

  dropColIndicatorDown.value.style.display = 'block';
  dropColIndicatorUp.value.style.display = 'block';
  return;
}

const getColIdx = (name: string): number => columns.value.findIndex((col) => col.name === name);

const getClosestColEl = (target: HTMLElement): HTMLElement | null => target.closest('.vdt-th');

function getOffset(target: HTMLElement): { top: number; left: number } {
  return { top: target.offsetTop, left: target.offsetLeft };
}
</script>

<style>
.vdt-row--separators {
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
}
.vdt-col--separators {
  border-right: 1px solid rgba(255, 255, 255, 0.6);
}
.clickable {
  cursor: pointer;
}
.vdt--resizer {
  width: 1px;
  position: absolute;
  z-index: 10;
  display: none;
  border: 1px solid var(--q-accent);
}
.vdt-th--expand,
.vdt-th--selection,
.vdt-td--selection {
  width: 60px;
}
</style>

<style lang="scss" scoped>
.vdt-container {
  position: relative;
}
.vdt-table {
  border: 1px solid rgba(255, 255, 255, 0.6);
}
.vdt--drop-indicator {
  position: absolute;
  display: none;
  font-size: 2rem;
  z-index: 100;
}
.vdt-top {
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 10px 10px 5px 10px;
}
.vdt-top--title {
  font-size: 1.5em;
}
.vdt-bottom {
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 5px 10px 10px 10px;
  display: flex;
}
.vdt-hdr-filter {
  padding: 5px;
}
.vdt-global-filter-input {
  margin-left: 5px;
  margin-right: 5px;
}
.vdt-loading {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.vdt-no-data {
  padding: 10px;
}
.vdt-bottom-spacer {
  flex-grow: 1;
}
</style>
