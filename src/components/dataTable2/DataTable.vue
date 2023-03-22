<template>
  <div
    class="vdt--root-wrapper"
    role="presentation"
    :style="{ height: `${rootHeight}px` }"
  >
    <div ref="resizerRef" class="vdt--resizer" />
    <div class="vdt--column-drop-wrapper" role="presentation">
      <div
        ref="dropColIndicatorDown"
        class="mdi mdi-arrow-down-bold vdt--drop-indicator"
      />
      <div
        ref="dropColIndicatorUp"
        class="mdi mdi-arrow-up-bold vdt--drop-indicator"
      />
    </div>

    <div class="vdt--root-wrapper-body" role="presentation">
      <div
        class="vdt--root"
        role="treegrid"
        :aria-colcount="processedColumns.length"
        :aria-multiselectable="true"
        :aria-rowcount="rows.length"
      >
        <table-header
          :columns="processedColumns"
          :thead-container-style="theadContainerStyle"
          :thead-tr-style="theadTrStyle"
          :row-height="rowHeight"
          @on-resize-start="onColResizeStart"
        />

        <div class="vdt--tbody" role="presentation" :style="tbodyStyle">
          <div class="vdt--tbody-clipper" role="presentation">
            <div
              ref="tbodyScrollRef"
              class="vdt--tbody-viewport"
              role="presentation"
              :style="tbodyViewportStyle"
            >
              <div
                class="vdt--tbody-container"
                role="rowgroup"
                :style="tbodyContainerStyle"
              >
                <div
                  v-for="(row, rowIdx) in visibleRows"
                  :key="rowIdx"
                  class="vdt--row"
                  :class="rowIdx % 2 ? 'vdt--row-even' : 'vdt--row-odd'"
                  :style="{ height: `${rowHeight}px` }"
                  :row-index="rowIdx"
                  role="row"
                >
                  <div
                    v-for="(col, colIdx) in processedColumns"
                    :key="colIdx"
                    class="vdt--cell"
                    :aria-colcount="colIdx + 1"
                    tabindex="-1"
                    role="gridcell"
                    :style="{ width: `${col.width}px` }"
                  >
                    {{ row[col.field] }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- fake vertical scroll -->
          <!-- <div
            class="vdt--tbody-vscroll"
            aria-hidden="true"
            :style="tbodyVscrollStyle"
          > -->
          <div
            ref="vscrollRef"
            class="vdt--tbody-vscroll-viewport"
            :style="tbodyVscrollStyle"
            @mousedown="(e) => handleVScrollEvent(e, true)"
            @mouseup="(e) => handleVScrollEvent(e, false)"
          >
            <div
              class="vdt--tbody-vscroll-container"
              :style="{ ...tbodyVscrollStyle, height: `${tbodyHeight}px` }"
            />
          </div>
          <!-- </div> -->
        </div>

        <!-- fake horizontal scroll -->
        <div
          class="vdt--tbody-hscroll"
          aria-hidden="true"
          :style="tbodyHscrollStyle"
        >
          <div
            class="vdt--tbody-hscroll-lspacer"
            style="width: 0px; max-width: 0px; min-width: 0px"
          />
          <div
            ref="hscrollRef"
            class="vdt--tbody-hscroll-viewport"
            :style="tbodyHscrollStyle"
            @mousedown="(e) => handleHScrollEvent(e, true)"
            @mouseup="(e) => handleHScrollEvent(e, false)"
          >
            <div
              class="vdt--tbody-hscroll-container"
              :style="{ ...tbodyHscrollStyle, width: `${colWidths}px` }"
            />
          </div>
          <div class="vdt--tbody-hscroll-rspacer" :style="tbodyVscrollStyle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { VColumn } from '../DataTable/types';
import TableHeader from './TableHeader.vue';

interface Props {
  columns: VColumn[];
  rows: any[];
  rootHeight?: number;
  rowHeight?: number;
  virtualScrollNodePadding?: number;
}

const props = withDefaults(defineProps<Props>(), {
  rootHeight: 600,
  rowHeight: 28,
  virtualScrollNodePadding: 20,
});

const resizerRef = ref<HTMLElement | undefined>();
const tbodyScrollRef = ref<HTMLElement | undefined>();
const vscrollRef = ref<HTMLElement | undefined>();
const hscrollRef = ref<HTMLElement | undefined>();

const processedColumns = ref(processColumns(props.columns));
watch(
  () => props.columns,
  (newCols) => (processedColumns.value = processColumns(newCols))
);

function processColumns(columns: VColumn[]) {
  return columns;
}

const colWidths = computed(() => {
  let width = 0;
  processedColumns.value.map((col: any) => (width += col.width || 150));
  console.log(width);
  return width;
});

const tbodyHeight = computed(() => props.rows.length * props.rowHeight);

const tbodyVscrollStyle = { width: '15px', maxWidth: '15px', minWidth: '15px' };
const tbodyHscrollStyle = {
  height: '15px',
  maxHeight: '15px',
  minHeight: '15px',
};

const theadContainerStyle = computed(() => {
  return {
    width: `${colWidths.value}px`,
    transform: `translateX(${-scrollLeft.value}px)`,
  };
});

const theadTrStyle = computed(() => {
  return {
    top: '0px',
    height: `${props.rowHeight}px`,
    width: `${colWidths.value}px`,
  };
});

const scrollLeft = ref(0);
watch(scrollLeft, (newVal, oldVal) => {
  return;
});

const scrollTop = ref(0);
watch(scrollLeft, (newVal, oldVal) => {
  return;
});

const startNode = computed(() => getStartNode(scrollTop.value));
const visibleNodesCount = computed(() =>
  getVisibleNodesCount(startNode.value, props.rows.length)
);
const offsetY = computed(() => startNode.value * props.rowHeight);

function getStartNode(scrollTop: number): number {
  let tmpStart =
    Math.floor(scrollTop / props.rowHeight) - props.virtualScrollNodePadding;
  return Math.max(0, tmpStart);
}

function getVisibleNodesCount(startNode: number, rowCount: number): number {
  const count =
    Math.ceil(props.rootHeight / props.rowHeight) +
    2 * props.virtualScrollNodePadding;
  return Math.min(rowCount - startNode, count);
}

const visibleRows = computed<any[]>(() =>
  props.rows.slice(startNode.value, startNode.value + visibleNodesCount.value)
);

const tbodyStyle = computed(() => {
  return { height: `${tbodyHeight.value}px` };
});
const tbodyContainerStyle = computed(() => {
  return {
    width: `${colWidths.value}px`,
    transform: `translateY(${offsetY.value}px)`,
  };
});
const tbodyViewportStyle = computed(() => {
  return { width: 'calc(100% + 15px)' };
});

const onVScroll = (event: UIEvent) => {
  const target = event.target as HTMLElement;
  const top = target.scrollTop;
  scrollTop.value = top;
  tbodyScrollRef.value.scrollTop = top;
  vscrollRef.value.scrollTop = top;
};

const onHScroll = (event: UIEvent) => {
  const target = event.target as HTMLElement;
  const left = target.scrollLeft;
  hscrollRef.value.scrollLeft = left;
  tbodyScrollRef.value.scrollLeft = left;
  scrollLeft.value = left;
};

function handleVScrollEvent(e: MouseEvent, attach: boolean) {
  if (attach) {
    tbodyScrollRef.value?.removeEventListener('scroll', onVScroll);
    e.target?.addEventListener('scroll', onVScroll);
  } else {
    e.target?.removeEventListener('scroll', onVScroll);
    tbodyScrollRef.value?.addEventListener('scroll', onVScroll);
  }
}

function handleHScrollEvent(e: MouseEvent, attach: boolean) {
  if (attach) e.target?.addEventListener('scroll', onHScroll);
  else e.target?.removeEventListener('scroll', onHScroll);
}

const dropColIndicatorDown = ref<HTMLElement | undefined>();
const dropColIndicatorUp = ref<HTMLElement | undefined>();

onMounted(() => tbodyScrollRef.value?.addEventListener('scroll', onVScroll));

const resizingCol = ref(false);
let curColEl: HTMLElement | null = null;
let curColResizing: VColumn | null = null;

let x = 0;
let diffX = 0;

function onColResizeStart(e: MouseEvent, col: VColumn) {
  if (!tbodyScrollRef.value || resizingCol.value) return;
  e.preventDefault();

  resizingCol.value = true;
  x = e.clientX;
  curColResizing = col;
  curColEl = (e.target as HTMLElement).parentElement;

  document.addEventListener('mousemove', onColResizeMove);
  document.addEventListener('mouseup', onColResizeEnd);
}

const onColResizeMove = (e: MouseEvent) => {
  if (!(tbodyScrollRef.value && resizerRef.value)) return;
  e.preventDefault();

  diffX = e.clientX - x;

  resizerRef.value.setAttribute(
    'style',
    `top: ${tbodyScrollRef.value.offsetTop}px; height: ${tbodyScrollRef.value.clientHeight}px; left: ${e.pageX}px; display:block;`
  );
};

const onColResizeEnd = () => {
  if (!(curColResizing && resizerRef.value && curColEl)) return;

  resizingCol.value = false;

  const colIdx = getColIdx(curColResizing.field);

  if (colIdx > -1) {
    processedColumns.value[colIdx].width = curColEl.offsetWidth + diffX;
    console.log(diffX);
    // need to check min and set to 0 if < 0
    scrollLeft.value += diffX;
    hscrollRef.value.scrollLeft += diffX;
    tbodyScrollRef.value.scrollLeft += diffX;
  }

  resizerRef.value.style.display = 'none';

  document.removeEventListener('mousemove', onColResizeMove);
  document.removeEventListener('mouseup', onColResizeEnd);
};

const getColIdx = (field: string): number =>
  processedColumns.value.findIndex((col) => col.field === field);
</script>

<style>
.vdt--root-wrapper {
  border: 1px solid rgba(255, 255, 255, 0.8);
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
  border: rgba(255, 255, 255, 0.8);
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
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
  position: absolute;
  overflow: hidden;
}
.vdt--th {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.6);
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
  flex-direction: row-reverse;
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
  align-self: stretch;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
}
.vdt--cell {
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  white-space: nowrap;
  height: 100%;
  border-right: 1px solid rgba(255, 255, 255, 0.6);
  padding: 5px;
}
/*.vdt--tbody-vscroll,*/
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
