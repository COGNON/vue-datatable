<template>
  <div class="vdt--th vdt--th-filter" aria-description="Type to filter column" :style="{ width: `${col.width}px` }">
    <q-input :model-value="filter" filled :style="{ width: `${col.width}px` }" />
  </div>
</template>

<script setup lang="ts">
import { VColumn } from '../DataTable/types';

defineProps<{
  col: VColumn;
  filter: string | null;
}>();
</script>
