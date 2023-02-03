<template>
  <div :class="`vdt-thead ${rowSeparatorCls}`">
    <div
      v-for="col in columns"
      :key="col.field"
      :column="col"
      :class="`vdt-th ${colSeparatorCls}`"
      :style="`width:${col.width}px;`"
    >
      <div class="vdt-th-content">
        <template v-if="$slots[`header-cell-${col.field}`]">
          <slot :name="`header-cell-${col.field}`"></slot>
        </template>
        <template v-else-if="$slots['header-cell']">
          <slot name="header-cell"></slot>
        </template>
        <template v-else>
          {{ col.header }}
        </template>
      </div>

      <template v-if="filterHeader">
        <input
          v-model="filters[col.field]"
          type="text"
          :style="`width:${col.width}px;`"
          class="vdt-hdr-filter"
          @update:model-value="
            emit('updateFilter', col.field, filters[col.field])
          "
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { CellSeparators, VColumn, VFilters } from './types';

const filters = ref<VFilters>({});

interface VHeaderProps {
  columns: VColumn[];
  filterHeader: boolean;
  rowSeparatorCls: string;
  colSeparatorCls: string;
}

const props = defineProps<VHeaderProps>();

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
