<template>
  <div :class="`vdt-thead ${rowSeparatorCls}`">
    <header-cell
      v-for="col in columns"
      :key="col.field"
      :column="col"
      :class="`vdt-th ${colSeparatorCls}`"
      :style="`width:${col.width}px;`"
      :sorter="sorters[col.field]"
      @update-sorter="emit('updateSorter', col.field)"
    >
      <template v-if="$slots[`header-cell-${col.field}`]" #header-cell>
        <slot :name="`header-cell-${col.field}`"></slot>
      </template>
      <template v-else-if="$slots['header-cell']" #header-cell>
        <slot name="header-cell"></slot>
      </template>

      <template #filter>
        <slot name="filter" :col="col"> </slot>
      </template>
    </header-cell>
  </div>
</template>

<script setup lang="ts">
import { type Component, computed, ref } from 'vue';
import { CellSeparators, VColumn, VFilters, VSorter } from './types';
import HeaderCell from './HeaderCell.vue';

interface VHeaderProps {
  columns: VColumn[];
  rowSeparatorCls: string;
  colSeparatorCls: string;
  sorters: VSorter;
}

const props = defineProps<VHeaderProps>();

const emit = defineEmits<{
  (e: 'updateSorter', field: string): void;
}>();
</script>

<style scoped>
.vdt-thead {
  display: flex;
}

.vdt-th {
  padding: 5px;
}
</style>
