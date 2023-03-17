<template>
  <div class="vdt-cell-content">
    <template v-if="$slots[`body-cell-${column.field}`]">
      <slot :name="`body-cell-${column.field}`" />
    </template>
    <template v-else-if="$slots['body-cell']">
      <slot name="body-cell" />
    </template>
    <template v-else>
      {{ row[column.field] }}
    </template>
  </div>
</template>

<script setup lang="ts">
import { VColumn } from './types';

defineProps<{
  column: VColumn;
  row: any;
}>();
</script>

<style lang="scss" scoped>
.vdt-cell,
.vdt-cell-content {
  overflow: hidden;
  text-overflow: ellipsis;
}

.vdt-cell {
  padding: 5px;
  display: inline-block;
}
</style>
