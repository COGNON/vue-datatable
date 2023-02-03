<template>
  <div
    v-for="item in rows"
    :key="item.id"
    :style="`height:${rowHeight}px`"
    :class="`vdt-row ${rowSeparatorCls}`"
  >
    <div
      v-for="col in columns"
      :key="col.field"
      :style="`width:${col.width}px;height:${rowHeight}px`"
      :class="`vdt-cell ${colSeparatorCls}`"
    >
      <div class="vdt-cell-content">
        <template v-if="$slots[`body-cell-${col.field}`]">
          <slot :name="`body-cell-${col.field}`"></slot>
        </template>
        <template v-else-if="$slots['body-cell']">
          <slot name="body-cell"></slot>
        </template>
        <template v-else>
          {{ item[col.field] }}
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CellSeparators, VColumn } from './types';

interface VScrollerProps {
  rows: any[];
  columns: VColumn[];
  rowHeight: number;
  rowSeparatorCls: string;
  colSeparatorCls: string;
}

const props = withDefaults(defineProps<VScrollerProps>(), {
  rows: () => [],
  rowHeight: 48,
});
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
