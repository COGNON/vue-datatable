<template>
  <div class="vdt--th-filter" aria-description="Type to filter column" :style="{ width: `${col.width}px` }">
    <q-input
      :model-value="filter"
      filled
      dense
      :style="{ width: `${col.width}px` }"
      @update:model-value="(val) => $emit('update:modelValue', val)"
    />
  </div>
</template>

<script setup lang="ts">
import { VColumn } from '../DataTable/types';

defineProps<{ col: VColumn; filter: any }>();
defineEmits<{ (e: 'update:modelValue', val: any): void }>();
</script>
