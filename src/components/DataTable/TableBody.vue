<template>
  <table-row
    v-for="(item, idx) in rows"
    :key="item.id"
    :row="item"
    :row-height="rowHeight"
    :row-separator-cls="rowSeparatorCls"
    :col-separator-cls="colSeparatorCls"
    :hightlight-on-hover="hightlightOnHover"
    :striped-rows="idx % 2 ? stripedRows : false"
  >
    <template #cells>
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
    </template>

    <template v-if="$slots['expanded']" #expanded="rowProps">
      <slot name="expanded" v-bind="rowProps"></slot>
    </template>
  </table-row>
</template>

<script setup lang="ts">
import { VColumn } from './types';
import TableRow from './TableRow.vue';

interface VScrollerProps {
  rows: any[];
  columns: VColumn[];
  rowHeight: number;
  rowSeparatorCls: string;
  colSeparatorCls: string;
  hightlightOnHover: boolean;
  stripedRows: boolean;
}

withDefaults(defineProps<VScrollerProps>(), {
  rows: () => [],
  rowHeight: 48,
});
</script>

<style lang="scss" scoped>
.vdt-cell,
.vdt-cell-content {
  overflow: hidden;
  text-overflow: ellipsis;
}

.vdt-cell {
  padding: 5px;
}
</style>
