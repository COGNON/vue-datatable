<template>
  <div>
    <div v-if="filterGlobal" class="vdt-global-filter">
      <q-input
        v-model="globalFilter"
        style="width: 200px"
        class="vdt-global-filter-input"
        v-bind="filterComponentProps"
      />
    </div>

    <div ref="tableRef" class="vdt-table" role="table">
      <table-header
        :columns="columns"
        :row-separator-cls="rowSeparatorCls"
        :col-separator-cls="colSeparatorCls"
        :sorters="sorters"
        :reorderable-columns="reorderableColumns"
        :resizable-columns="resizableColumns"
        @update-sorter="updateSorters"
        @on-resize-start="onColResizeStart"
        @on-drag-start="onColDragStart"
        @on-drag-end="onColDragEnd"
        @on-drag-over="onColDragOver"
        @on-drop="onColDrop"
      >
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot v-if="$slots[name]" :name="name" v-bind="slotData"></slot>
        </template>

        <template v-if="filterHeader" #filter="colProps">
          <q-input
            v-model="filters[colProps.col.field]"
            class="vdt-hdr-filter"
            v-bind="filterComponentProps"
          />
        </template>
      </table-header>

      <virtual-scroller
        :rows="processedRows"
        :columns="columns"
        :row-height="rowHeight"
      >
        <template #content="scrollerProps">
          <table-body
            :rows="scrollerProps.visibleRows"
            :row-height="rowHeight"
            :columns="columns"
            :row-separator-cls="rowSeparatorCls"
            :col-separator-cls="colSeparatorCls"
            :hightlight-on-hover="hightlightOnHover"
          >
            <template v-for="(_, name) in $slots" #[name]="slotData">
              <slot v-if="$slots[name]" :name="name" v-bind="slotData"></slot>
            </template>
          </table-body>
        </template>
      </virtual-scroller>
    </div>

    <div v-if="resizableColumns" ref="resizerRef" class="vdt--resizer"></div>
    <template v-if="reorderableColumns">
      <div
        ref="dropColIndicatorDown"
        class="mdi mdi-arrow-down-bold vdt--drop-indicator"
      ></div>
      <div
        ref="dropColIndicatorUp"
        class="mdi mdi-arrow-up-bold vdt--drop-indicator"
      ></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { VColumn, VFilters, CellSeparators, VSorter } from './types';
import { computed, ref, watch } from 'vue';
import TableHeader from './TableHeader.vue';
import TableBody from './TableBody.vue';
import VirtualScroller from './VirtualScroller.vue';
import FilterComponent from './FilterComponent.vue';
import { QInputProps } from 'quasar';

const tableRef = ref<HTMLElement | undefined>();
const resizerRef = ref<HTMLElement | undefined>();
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
});

const columns = ref(props.columns);

const processedRows = ref(props.rows);
watch(
  () => props.rows,
  (newRows) => (processedRows.value = newRows)
);

const rowHeight = 48;

const rowSeparatorCls = computed<string>(() =>
  props.separators.match(/row|cell/) ? 'vdt-row--separators' : ''
);

const colSeparatorCls = computed<string>(() =>
  props.separators.match(/column|cell/) ? 'vdt-col--separators' : ''
);

const filters = ref<VFilters>({});

const filterComponentProps: Partial<QInputProps> = {
  dense: true,
  filled: true,
  label: 'Search',
};

function filterRows(filters: VFilters | string, rows: any[]): any[] {
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
      return row[field].toLowerCase().includes(filters[field].toLowerCase());
    });
  });
}

watch(
  filters,
  (newFilters) =>
    (processedRows.value = filterRows(newFilters, processedRows.value)),
  {
    deep: true,
  }
);

const globalFilter = ref();
watch(globalFilter, (newFilter) => {
  // use the original rows. if user backspaces from no rows filtered, it will still return no rows
  processedRows.value = filterRows(newFilter, props.rows);
});

const sorters = ref<VSorter>({});
watch(sorters, () => (processedRows.value = sortRows(processedRows.value)), {
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
    .map((sorter) =>
      sorter.dir === 'des' ? `-${sorter.field}` : sorter.field
    );

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

const resizingCol = ref(false);
let curColEl: HTMLElement | null = null;
let curColResizing: VColumn | null = null;

let x = 0;
let diffX = 0;

function onColResizeStart(e: MouseEvent, col: VColumn) {
  if (!tableRef.value || resizingCol.value) return;
  e.preventDefault();

  resizingCol.value = true;
  x = e.clientX;
  curColResizing = col;
  curColEl = (e.target as HTMLElement).parentElement;

  document.addEventListener('mousemove', onColResizeMove);
  document.addEventListener('mouseup', onColResizeEnd);
}

const onColResizeMove = (e: MouseEvent) => {
  if (!(tableRef.value && resizerRef.value)) return;
  e.preventDefault();

  diffX = e.clientX - x;

  resizerRef.value.setAttribute(
    'style',
    `top: ${tableRef.value.offsetTop}px; height: ${tableRef.value.clientHeight}px; left: ${e.pageX}px; display:block;`
  );
};

const onColResizeEnd = () => {
  if (!(curColResizing && resizerRef.value && curColEl)) return;

  resizingCol.value = false;

  const colIdx = getColIdx(curColResizing.field);

  if (colIdx > -1) {
    columns.value[colIdx].width = curColEl.offsetWidth + diffX;
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
    e.dataTransfer.setData('text', sourceCol.getAttribute('field') as string);
  }
}

function onColDrop(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();

  const targetCol = getClosestColEl(e.target as HTMLElement);
  if (!targetCol) return;

  const data = e.dataTransfer?.getData('text');
  const [srcField, placeOnRight] = data?.split('~~');

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
    dropColIndicatorDown.value.setAttribute(
      'style',
      `top: ${iconDownTop}px;left:${iconRightLocation}`
    );
    dropColIndicatorUp.value.setAttribute(
      'style',
      `top: ${iconUpTop}px;left:${iconRightLocation}`
    );
  } else {
    // place indicators to left of targetCol
    dropColIndicatorDown.value.setAttribute(
      'style',
      `top: ${iconDownTop}px;left:${iconLeftLocation}`
    );
    dropColIndicatorUp.value.setAttribute(
      'style',
      `top: ${iconUpTop}px;left:${iconLeftLocation}`
    );
  }

  dropColIndicatorDown.value.style.display = 'block';
  dropColIndicatorUp.value.style.display = 'block';
  return;
}

const getColIdx = (field: string): number =>
  columns.value.findIndex((col) => col.field === field);

const getClosestColEl = (target: HTMLElement): HTMLElement | null =>
  target.closest('.vdt-th');

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
.vdt-global-filter-input {
  margin-left: 5px;
  margin-right: 5px;
}
.clickable {
  cursor: pointer;
}
.vdt-hdr-filter {
  padding: 5px;
}
.vdt--resizer {
  width: 1px;
  position: absolute;
  z-index: 10;
  display: none;
  border: 1px solid var(--q-accent);
}
.vdt-table .vdt-thead > .vdt-th:last-child .vdt-column--resizer {
  display: none;
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
</style>
