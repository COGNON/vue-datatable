<template>
  <div>
    <div v-if="filters && !filterHeader" class="vdt-global-filter">
      <label for="global-filter">Search</label>
      <input
        v-model="globalFilter"
        type="text"
        style="width: 200px"
        name="global-filter"
        class="vdt-global-filter-input"
      />
    </div>

    <div class="vdt-table" role="table">
      <table-header
        :columns="columns"
        :filter-header="filterHeader"
        :row-separator-cls="rowSeparatorCls"
        :col-separator-cls="colSeparatorCls"
        @update-filter="updateFilter"
      >
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
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
          >
            <template v-for="(_, name) in $slots" #[name]="slotData">
              <slot :name="name" v-bind="slotData" />
            </template>
          </table-body>
        </template>
      </virtual-scroller>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VColumn, VFilters, CellSeparators } from './types';
import { computed, onMounted, ref, watch } from 'vue';
import TableHeader from './TableHeader.vue';
import TableBody from './TableBody.vue';
import VirtualScroller from './VirtualScroller.vue';

interface VGridProps {
  rows: any[];
  columns: VColumn[];
  filters?: boolean;
  filterHeader?: boolean;
  separators?: CellSeparators;
}

const props = withDefaults(defineProps<VGridProps>(), {
  rows: () => [],
  filters: false,
  filterHeader: false,
  separators: 'row',
});

const processedRows = ref(props.rows);
watch(
  () => props.rows,
  (newRows) => (processedRows.value = newRows)
);

const rowHeight = 48;

const rowSeparatorCls = computed<string>(() =>
  props.separators.match(/row|cell/) ? 'vdt-separators-row' : ''
);

const colSeparatorCls = computed<string>(() =>
  props.separators.match(/column|cell/) ? 'vdt-separators-col' : ''
);

const filters = ref<VFilters>({});
function updateFilter(field: string, value: string): void {
  if (value) filters.value[field] = value;
  else delete filters.value[field];
}

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
</script>

<style>
.vdt-separators-row {
  border-bottom: 1px solid white;
}

.vdt-separators-col {
  border-left: 1px solid white;
}

.vdt-global-filter-input {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
