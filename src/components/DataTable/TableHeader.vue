<template>
  <div :class="`vdt-thead ${rowSeparatorCls}`">
    <div v-if="$slots['expanded']" style="width: 60px"></div>

    <template v-for="col in columns" :key="col.field">
      <header-cell
        :column="col"
        :class="`vdt-th ${colSeparatorCls}`"
        :style="`width:${col.width}px;`"
        :sorter="sorters[col.field]"
        @update-sorter="(e) => $emit('updateSorter', e, col.field)"
        @on-resize-start="(e) => $emit('onResizeStart', e, col)"
      >
        <template v-if="$slots[`header-cell-${col.field}`]" #header-cell>
          <slot :name="`header-cell-${col.field}`"></slot>
        </template>
        <template v-else-if="$slots['header-cell']" #header-cell>
          <slot name="header-cell"></slot>
        </template>

        <template #filter>
          <slot name="filter" :col="col"></slot>
        </template>
      </header-cell>
    </template>
  </div>
</template>

<script setup lang="ts">
import { VColumn, VSorter } from './types';
import HeaderCell from './HeaderCell.vue';

interface VHeaderProps {
  columns: VColumn[];
  rowSeparatorCls: string;
  colSeparatorCls: string;
  sorters: VSorter;
}

defineProps<VHeaderProps>();

defineEmits<{
  (e: 'updateSorter', event: MouseEvent, field: string): void;
  (e: 'onResizeStart', event: MouseEvent, col: VColumn): void;
}>();
</script>

<style lang="scss" scoped>
.vdt-thead {
  display: flex;
}

.vdt-th {
  padding: 5px;
}
</style>
