<template>
  <div>
    <span
      class="vdt-th-content clickable"
      @click="(e: MouseEvent) => emit('updateSorter',e)"
    >
      <slot name="header-cell">
        {{ column.header }}
      </slot>
    </span>

    <span v-if="sorter" :class="`mdi mdi-sort-${sorterIcon}`"> </span>

    <slot name="filter"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VColumn, VSorterData } from './types';

const props = defineProps<{
  column: VColumn;
  sorter: VSorterData;
}>();

const sorterIcon = computed(() =>
  props.sorter ? (props.sorter.dir === 'asc' ? 'ascending' : 'descending') : ''
);

const emit = defineEmits<{
  (e: 'updateSorter', event: MouseEvent): void;
}>();
</script>

<style>
.vdt-th-content {
  margin: 5px;
}
</style>
