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

    <div class="vdt-table" role="table">
      <table-header
        :columns="columns"
        :row-separator-cls="rowSeparatorCls"
        :col-separator-cls="colSeparatorCls"
        :sorters="sorters"
        @update-sorter="updateSorters"
      >
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData"></slot>
        </template>

        <template v-if="filterHeader" #filter="colProps">
          <q-input
            v-model="filters[colProps.col.field]"
            :style="`width:${colProps.col.width}px;`"
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
          >
            <template v-for="(_, name) in $slots" #[name]="slotData">
              <slot :name="name" v-bind="slotData"></slot>
            </template>
          </table-body>
        </template>
      </virtual-scroller>
    </div>
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

interface VGridProps {
  rows: any[];
  columns: VColumn[];
  filterGlobal?: boolean;
  filterHeader?: boolean;
  separators?: CellSeparators;
}

const props = withDefaults(defineProps<VGridProps>(), {
  rows: () => [],
  filters: false,
  filterHeader: false,
  separators: 'row',
  filterComponent: FilterComponent,
  filterComponentProps: {},
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

.clickable {
  cursor: pointer;
}

.vdt-hdr-filter {
  padding: 5px;
}
</style>
