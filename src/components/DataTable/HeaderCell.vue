<template>
  <th class="vdt--th" tabindex="-1" :name="col.colId">
    <div
      v-if="resizableColumns && col.resizable"
      class="vdt--th-resizer"
      @mousedown.stop.left="(e: MouseEvent) => $emit('onResizeStart', e)"
    />

    <div
      class="vdt--th-label"
      role="presentation"
      :style="
        col.align === 'left'
          ? ''
          : { justifyContent: col.align === 'right' ? 'flex-end' : col.align }
      "
    >
      <span class="vdt--th-label-text vdt--clickable" @click="(e) => $emit('updateSorter', e)">
        <slot name="header-cell" :col="col" :header="col.header">
          {{ col.header }}
        </slot>
      </span>
      <svg-icon
        v-if="sorterIcon"
        type="mdi"
        :path="sorterIcon"
        width="15"
        height="15"
        class="vdt--sort-icon"
      />
      <sub v-if="sorters.length > 1">{{ sorterIdx + 1 }}</sub>
    </div>

    <slot name="filter" />
  </th>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VColumn, VSorter } from '../types';
import { findSorterIndex } from '../utils';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiSortAscending, mdiSortDescending } from '@mdi/js';

const props = defineProps<{
  col: Required<VColumn>;
  resizableColumns: boolean;
  sorters: VSorter[];
}>();

defineEmits<{
  (e: 'updateSorter', event: MouseEvent): void;
  (e: 'onResizeStart', event: MouseEvent): void;
}>();

const sorterIdx = computed(() => findSorterIndex(props.sorters, props.col.colId));
const sorterIcon = computed(() => {
  if (sorterIdx.value === -1) return null;
  return props.sorters[sorterIdx.value]['dir'] === 'asc' ? mdiSortAscending : mdiSortDescending;
});
</script>

<style scoped>
.vdt--sort-icon {
  margin: 0px 3px;
}
.vdt--th-label {
  display: flex;
  align-items: center;
}
.vdt--th-label,
.vdt--th-label-text {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
