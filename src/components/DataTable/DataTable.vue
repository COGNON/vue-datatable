<template>
  <div class="vdt-table" role="table">
    <table-header
      :columns="columns"
      :filter-header="filterHeader"
      @update-filter="updateFilter"
    />

    <div ref="root" class="vdt-tbody" :style="rootStyle" @scroll="onScroll">
      <div ref="viewport" class="vdt-viewscroller" :style="viewportStyle">
        <div ref="spacer" class="vdt-spacer" :style="spacerStyle">
          <div
            v-for="item in visibleRows"
            :key="item.id"
            :style="`height:${rowHeight}px`"
            class="vdt-row"
          >
            <div
              v-for="col in columns"
              :key="col.field"
              :style="`width:${col.width}px;height:${rowHeight}px`"
              class="vdt-cell"
            >
              <div class="vdt-cell-content">
                {{ item[col.field] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VColumn, VFilters } from './types';
import { computed, onMounted, ref, watch } from 'vue';
import TableHeader from './TableHeader.vue';
// // import TableBody from './TableBody.vue';
// // import VirtualScroller from './VirtualScroller.vue';

const filters = ref<VFilters>({});
function updateFilter(field: string, value: string): void {
  if (value) filters[field] = value;
  else delete filters[field];
}

function filterFields(): void {
  return;
}

interface VGridProps {
  rows: any[];
  columns: VColumn[];
  filters?: boolean;
  filterHeader?: boolean;
}

const props = withDefaults(defineProps<VGridProps>(), {
  rows: () => [],
  filters: false,
  filterHeader: false,
});

const processedRows = computed(() => processRows(props.rows));
function processRows(rows: any[]): any[] {
  return rows;
}

const rowHeight = 48;
const nodePadding = 20;
const rootHeight = 500;

const root = ref(null);
const viewport = ref(null);
const spacer = ref(null);

const rowCount = computed(() => processedRows.value.length);
const viewportHeight = computed(() => rowCount.value * rowHeight);

const scrollTop = ref(0);
const startNode = computed(() => getStartNode(scrollTop.value));
const visibleNodesCount = computed(() =>
  getVisibleNodesCount(startNode.value, rowCount.value)
);
const offsetY = computed(() => startNode.value * rowHeight);
const visibleRows = computed<unknown[]>(() =>
  getVisibleNodes(startNode.value, startNode.value + visibleNodesCount.value)
);

const spacerStyle = computed(() => {
  return { transform: `translateY(${offsetY.value}px)` };
});

const viewportStyle = computed(() => {
  return {
    overflow: 'hidden',
    height: viewportHeight.value + 'px',
    position: 'relative',
  };
});

const rootStyle = computed(() => {
  return {
    height: rootHeight + 'px',
    overflow: 'auto',
  };
});

// const vsClass = 'vdt-virtualscroller';
// const contentClass = 'vdt-virtualscroller-content';

function getVisibleNodes(
  startNode: number,
  visibleNodesCount: number
): unknown[] {
  return processedRows.value.slice(startNode, visibleNodesCount);
}

function getStartNode(scrollTop: number): number {
  let tmpStart = Math.floor(scrollTop / rowHeight) - nodePadding;
  return Math.max(0, tmpStart);
}

function getVisibleNodesCount(startNode: number, rowCount: number): number {
  const count = Math.ceil(viewportHeight.value / rowHeight) + 2 * nodePadding;
  return Math.min(rowCount - startNode, count);
}

function onScroll(event: UIEvent) {
  const target = event.target as HTMLElement;
  scrollTop.value = target.scrollTop;
}

// const containerClass = 'vdt-datatable';

// function rowsToRender(rows: unknown[]) {
//   const _data = rows;
//   return _data;
// }
</script>

<style>
.vdt-row {
  display: flex;
}

.vdt-cell,
.vdt-cell-content {
  overflow: hidden;
  text-overflow: ellipsis;
}

.vdt-cell {
  padding: 5px;
}
</style>
