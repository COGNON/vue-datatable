<template>
  <div
    ref="rootRef"
    :class="`vdt--root-wrapper ${tableBorderCls}`"
    role="presentation"
    :style="{ height: `${rootHeight}px` }"
  >
    <div v-if="resizableColumns" ref="resizerRef" class="vdt--resizer" />
    <div v-if="reorderableColumns" class="vdt--column-drop-wrapper" role="presentation">
      <div ref="dropColIndicatorDown" class="mdi mdi-arrow-down-bold vdt--drop-indicator" />
      <div ref="dropColIndicatorUp" class="mdi mdi-arrow-up-bold vdt--drop-indicator" />
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
          @on-resize-start="onColResizeStart"
          @on-drag-start="onColDragStart"
          @on-drag-end="onColDragEnd"
          @on-drag-over="onColDragOver"
          @on-drop="onColDrop"
        >
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot v-if="String(slotName).startsWith('header')" :name="slotName" v-bind="slotProps || {}" />
          </template>
        </table-header>

        <virtual-scroller
          v-slot="{ processedRows, startNode }"
          :rows="rows"
          :columns="processedColumns"
          :root-height="rootHeight"
          :virtual-scroll-node-padding="virtualScrollNodePadding"
          :row-height="rowHeight"
          :col-widths="colWidths"
          :scroll-left="scrollLeft"
          :striped-rows="stripedRows"
        >
          <table-body
            :rows="processedRows"
            :columns="processedColumns"
            :row-height="rowHeight"
            :col-widths="colWidths"
            :virtual-start-node="startNode"
          >
            <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
              <slot v-if="String(slotName).startsWith('body')" :name="slotName" v-bind="slotProps || {}" />
            </template>
          </table-body>
        </virtual-scroller>

        <!-- fake horizontal scroll -->
        <fake-horizontal-scroll :col-widths="colWidths" @update-scroll="(val) => (scrollLeft = val)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import { VColumn, VFilter, VSorter } from '../DataTable/types';
import TableHeader from './TableHeader.vue';
import FakeHorizontalScroll from './FakeHorizontalScroll.vue';
import VirtualScroller from './VirtualScroller.vue';
import TableBody from './TableBody.vue';
import { findSorterIndex } from '../utils';
import { useSorter } from 'src/composables/useSorter';

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
  defaultFilters?: VFilter;
  defaultSorters?: VSorter[];
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
  defaultFilters: () => {
    return {};
  },
  defaultSorters: () => [],
});

const resizerRef = ref<HTMLElement | undefined>();
const rootRef = ref<HTMLElement | undefined>();

const cellBorderCls = computed(() => {
  if (props.borders === 'none') return '';

  let cls = [];
  if (props.borders.match(/both|cell/)) cls.push('vdt--cell-borders');
  if (props.borders.match(/both|row/)) cls.push('vdt--row-borders');

  return cls.join(' ');
});

const tableBorderCls = computed(() => (props.bordered ? 'vdt--table-border' : ''));
const hoverCls = computed(() => (props.hightlightOnHover ? 'vdt--row-highlight' : ''));
const stripedCls = computed(() => (props.stripedRows ? 'vdt--striped-rows' : ''));

const processedColumns = ref(processColumns(props.columns));
watch(
  () => props.columns,
  (newCols) => (processedColumns.value = processColumns(newCols))
);

function processColumns(columns: VColumn[]) {
  return columns;
}

const { sortRows } = useSorter();
const sorters = ref(props.defaultSorters);

const rows = ref(processRows(props.rows));
watch(
  () => props.defaultSorters,
  (newSorters) => {
    sorters.value = newSorters;
    rows.value = sortRows(newSorters, rows.value);
  }
);

function updateSorters(e: MouseEvent, field: string): void {
  const sorterIdx = findSorterIndex(sorters.value, field);
  if (e.ctrlKey) {
    // multi-sort key
    if (sorterIdx === -1) {
      // sorter doesn't exist, add to end
      sorters.value.push({ field: field, dir: 'asc' });
    } else {
      // check direction
      if (sorters.value[sorterIdx]['dir'] === 'asc') {
        // swap to des
        sorters.value[sorterIdx]['dir'] = 'desc';
      } else {
        // remove sorter
        sorters.value.splice(sorterIdx, 1);
      }
    }
  } else {
    if (sorterIdx === -1) {
      // replace sorters
      sorters.value = [{ field: field, dir: 'asc' }];
    } else {
      // sorter exists
      if (sorters.value[sorterIdx]['dir'] === 'asc') {
        // swap to des
        sorters.value = [{ field: field, dir: 'desc' }];
      } else {
        // remove sorter
        sorters.value = [];
      }
    }
  }

  rows.value = sortRows(sorters.value, props.rows);
}

const filters = ref(props.defaultFilters);
watch(
  () => props.defaultFilters,
  (newFilters) => (filters.value = newFilters)
);

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

function processRows(rows: any[]) {
  return sortRows(sorters.value, rows);
}
watch(
  () => props.rows,
  (newRows) => (rows.value = newRows)
);

const colWidths = computed(() => {
  let width = 0;
  processedColumns.value.map((col: any) => (width += col.width || 150));
  return width;
});

const scrollLeft = ref(0);

const dropColIndicatorDown = ref<HTMLElement | undefined>();
const dropColIndicatorUp = ref<HTMLElement | undefined>();

const resizingCol = ref(false);
let curColEl: HTMLElement | null = null;
let curColResizing: VColumn | null = null;

let x = 0;
let diffX = 0;

function onColResizeStart(e: MouseEvent, col: VColumn) {
  e.preventDefault();

  resizingCol.value = true;
  x = e.clientX;
  curColResizing = col;
  curColEl = (e.target as HTMLElement).parentElement;

  document.addEventListener('mousemove', onColResizeMove);
  document.addEventListener('mouseup', onColResizeEnd);
}

const onColResizeMove = (e: MouseEvent) => {
  if (!(rootRef.value && resizerRef.value)) return;
  e.preventDefault();
  diffX = e.clientX - x;

  resizerRef.value.setAttribute(
    'style',
    ` height: ${rootRef.value.clientHeight}px; left: ${e.pageX}px; display:block;`
  );
};

const onColResizeEnd = () => {
  if (!(curColResizing && resizerRef.value && curColEl && rootRef.value)) return;

  resizingCol.value = false;
  const colIdx = getColIdx(curColResizing.name);

  if (colIdx > -1) {
    const maxScrollWidth = colWidths.value - rootRef.value.clientWidth;
    if (diffX < 0 && scrollLeft.value >= maxScrollWidth) {
      scrollLeft.value = Math.max(0, scrollLeft.value + diffX);
    }
    processedColumns.value[colIdx].width = curColEl.offsetWidth + diffX;
  }

  resizerRef.value.style.display = 'none';

  document.removeEventListener('mousemove', onColResizeMove);
  document.removeEventListener('mouseup', onColResizeEnd);
};

function onColDragStart(e: DragEvent) {
  const sourceCol = e.target as HTMLElement;
  sourceCol.style.opacity = '0.4';
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text', sourceCol.getAttribute('name') as string);
  }
}

function onColDrop(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();

  const targetCol = getClosestColEl(e.target as HTMLElement);
  if (!targetCol) return;

  const data = e.dataTransfer?.getData('text');
  const [srcField] = data?.split('~~');
  const destField = targetCol.getAttribute('name');

  if (!(srcField && destField)) return;

  if (srcField !== destField) {
    const srcColIdx = getColIdx(srcField);
    const sourceCol = processedColumns.value.splice(srcColIdx, 1);
    const destColIdx = getColIdx(destField);
    const colCenter = targetCol.offsetLeft + targetCol.offsetWidth / 2;

    if (colCenter < e.clientX) {
      // move after
      processedColumns.value.splice(destColIdx + 1, 0, sourceCol[0]);
    } else {
      // move before
      processedColumns.value.splice(destColIdx, 0, sourceCol[0]);
    }
  }

  return;
}

function onColDragEnd(e: DragEvent) {
  if (!(dropColIndicatorDown.value && dropColIndicatorUp.value)) return;
  (e.target as HTMLElement).style.opacity = '1';

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

const getColIdx = (name: string): number => processedColumns.value.findIndex((col) => col.name === name);

const getClosestColEl = (target: HTMLElement): HTMLElement | null => target.closest('.vdt--th');

function getOffset(target: HTMLElement): { top: number; left: number } {
  return { top: target.offsetTop, left: target.offsetLeft };
}
</script>

<style>
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
  width: 100%;
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
</style>
