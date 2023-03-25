<template>
  <div
    class="vdt--row"
    :class="rowIndex % 2 ? 'vdt--row-even' : 'vdt--row-odd'"
    role="row"
    :style="{ height: `${rowHeight * (expanded ? 2 : 1)}px` }"
  >
    <slot name="body-row" :row="row" :columns="columns" :row-index="rowIndex">
      <div v-if="$slots['body-expanded']" :class="`vdt--cell`">
        <q-btn :icon="expandIcon" round @click="expanded = !expanded" />
      </div>

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

    <div v-if="expanded && $slots['body-expanded']" class="vdt--row-expanded">
      <slot name="expanded" :row="row" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { VColumn } from '../DataTable/types';
import BodyCell from './BodyCell.vue';

defineProps<{
  row: any;
  columns: VColumn[];
  rowIndex: number;
  rowHeight: number;
}>();

const expanded = ref(false);
const expandIcon = computed(() => (expanded.value ? 'mdi-minus' : 'mdi-plus'));
</script>
