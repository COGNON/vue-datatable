<template>
  <div class="vdt-th">
    <div class="vdt-th--content">
      <span
        v-if="resizableColumns"
        class="vdt-column--resizer"
        @mousedown="(e) => $emit('onResizeStart', e)"
      ></span>
      <span
        :class="`vdt-th-content ${column.sortable ? 'clickable' : ''}`"
        @click="(e) => (column.sortable ? $emit('updateSorter', e) : null)"
      >
        <slot name="header-cell">
          {{ column.header }}
        </slot>
      </span>

      <span v-if="sorter" :class="`mdi mdi-sort-${sorterIcon}`"></span>
    </div>

    <div v-if="column.filterable" class="vdt-th--filter">
      <slot name="filter"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VColumn, VSorterData } from './types';

const props = defineProps<{
  column: VColumn;
  sorter: VSorterData;
  resizableColumns: boolean;
}>();

const sorterIcon = computed(() =>
  props.sorter ? (props.sorter.dir === 'asc' ? 'ascending' : 'descending') : ''
);

defineEmits<{
  (e: 'updateSorter', event: MouseEvent): void;
  (e: 'onResizeStart', event: MouseEvent): void;
}>();
</script>

<style lang="scss" scoped>
.vdt-th {
  position: relative;
}
.vdt-th-content {
  margin: 5px;
}
.vdt-column--resizer {
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
</style>
