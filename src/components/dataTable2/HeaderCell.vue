<template>
  <div class="vdt--th" role="columnheader" tabindex="-1" aria-description="Press Enter to Sort" :name="col.name">
    <div
      v-if="resizableColumns"
      class="vdt--th-resizer"
      @mousedown.stop.left="(e: MouseEvent) => $emit('onResizeStart', e)"
    />

    <div class="vdt--th-cell-wrapper" role="presentation">
      <div class="vdt--th-label-container" role="presentation">
        <div class="vdt--th-label" role="presentation">
          <span class="vdt--th-label-text vdt--clickable" @click="(e) => $emit('updateSorter', e)">
            <slot name="header-cell" :col="col" :header="col.header">
              {{ col.header }}
            </slot>
          </span>
          <div v-if="sorterIdx !== -1">
            <span :class="`mdi mdi-sort-${sorterIcon}`" />
            <sub v-if="sorters.length > 1">{{ sorterIdx + 1 }}</sub>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VColumn, VSorter } from '../DataTable/types';
import { findSorterIndex } from '../utils';

const props = defineProps<{
  col: VColumn;
  resizableColumns: boolean;
  sorters: VSorter[];
}>();

defineEmits<{
  (e: 'updateSorter', event: MouseEvent): void;
  (e: 'onResizeStart', event: MouseEvent): void;
}>();

const sorterIdx = computed(() => findSorterIndex(props.sorters, props.col.name));
const sorterIcon = computed(() => {
  if (sorterIdx.value === -1) return {};
  return props.sorters[sorterIdx.value]['dir'] === 'asc' ? 'ascending' : 'descending';
});
</script>
