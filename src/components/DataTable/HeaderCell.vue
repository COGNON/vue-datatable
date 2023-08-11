<template>
  <th class="vdt--th" tabindex="-1" :name="col.colId">
    <slot
      v-if="col.checkboxColumn"
      name="header-selection"
      :all-selected="allSelected"
      :select-all="selectAll"
    >
      <vdt-checkbox
        v-if="allowSelectAll && selection === 'multiple'"
        :model-value="allSelected"
        @update:model-value="selectAll"
      />
    </slot>

    <template v-if="col.expandColumn"></template>

    <template v-else>
      <div
        v-if="resizableColumns && col.resizable"
        class="vdt--th-resizer"
        @mousedown.stop.left="$emit('onResizeStart', $event)"
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
    </template>
  </th>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VColumn, VRow, VSelectionModes, VSorter } from '../types';
import { findSorterIndex } from '../utils';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiSortAscending, mdiSortDescending } from '@mdi/js';
import VdtCheckbox from './VdtCheckbox.vue';

const props = defineProps<{
  col: Required<VColumn>;
  resizableColumns: boolean;
  sorters: VSorter[];
  selection: VSelectionModes;
  selected: VRow[];
  totalRowCount: number;
  allowSelectAll: boolean;
}>();

const emit = defineEmits<{
  updateSorter: [event: MouseEvent];
  onResizeStart: [event: MouseEvent];
  selectAll: [selected: boolean];
}>();

const sorterIdx = computed(() => findSorterIndex(props.sorters, props.col.colId));
const sorterIcon = computed(() => {
  if (sorterIdx.value === -1) return null;
  return props.sorters[sorterIdx.value]['dir'] === 'asc' ? mdiSortAscending : mdiSortDescending;
});

const allSelected = computed(() => props.selected.length === props.totalRowCount);
const selectAll = (val: boolean) => emit('selectAll', val);
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
