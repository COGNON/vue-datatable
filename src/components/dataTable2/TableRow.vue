<template>
  <div class="vdt--row" :class="rowIndex % 2 ? 'vdt--row-even' : 'vdt--row-odd'" role="row">
    <slot name="body-row" :row="row" :columns="columns" :row-index="rowIndex">
      <body-cell v-for="(col, colIdx) in columns" :key="colIdx" :col-idx="colIdx" :col="col" :row="row">
        <!-- specific body cell slot takes precedence -->
        <template v-if="$slots[`body-cell-${col.name}`]" #body-cell="slotProps">
          <slot :name="`body-cell-${col.name}`" v-bind="slotProps" :row-index="rowIndex" />
        </template>
        <template v-else-if="$slots['body-cell']" #body-cell="slotProps">
          <slot name="body-cell" v-bind="slotProps" :row-index="rowIndex" />
        </template>
      </body-cell>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { VColumn } from '../DataTable/types';
import BodyCell from './BodyCell.vue';

defineProps<{
  row: any;
  columns: VColumn[];
  rowIndex: number;
}>();
</script>
