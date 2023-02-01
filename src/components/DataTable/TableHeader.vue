<template>
  <div class="vdt-thead">
    <div
      v-for="col in columns"
      :key="col.field"
      class="vdt-th"
      :style="`width:${col.width}px;`"
    >
      <div class="vdt-th-content">
        {{ col.header }}
      </div>

      <template v-if="filterHeader">
        <input
          v-model="filters[col.field]"
          type="text"
          :style="`width:${col.width}px;`"
          class="vdt-hdr-filter"
          @update-model="emit('updateFilter', col.field, filters[col.field])"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VColumn } from './types';

const filters = ref({});

defineProps<{
  columns: VColumn[];
  filterHeader: boolean;
}>();

const emit = defineEmits<{
  (e: 'updateFilter', field: string, value: string): void;
}>();
</script>

<style>
.vdt-thead {
  display: flex;
}

.vdt-th {
  padding: 5px;
}

.vdt-hdr-filter {
}
</style>
