<template>
  <td class="vdt--cell" :aria-colcount="colIdx + 1" tabindex="-1">
    <slot
      v-if="col.expandColumn"
      name="expanded-icon"
      :row="row"
      :expanded="expanded"
      :expand-row="expandRow"
    >
      <button class="vdt--expand-icon" @click="expandRow">
        <svg-icon class="mdi-icon" type="mdi" :path="expanded ? mdiMinus : mdiPlus" />
      </button>
    </slot>
    <slot
      v-else-if="col.checkboxColumn"
      name="body-selection"
      :row="row"
      :selected="selected"
      :select-row="selectRow"
    >
      <vdt-checkbox :model-value="selected" dense @update:model-value="selectRow" />
    </slot>
    <slot v-else name="body-cell" :col="col" :row="row" :value="value" :col-index="colIdx">
      {{ value }}
    </slot>
  </td>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VColumn, VRow } from '../types';
import VdtCheckbox from './VdtCheckbox.vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPlus, mdiMinus } from '@mdi/js';

const props = defineProps<{
  row: VRow;
  col: Required<VColumn>;
  colIdx: number;
  selected: boolean;
  expanded: boolean;
}>();

const emit = defineEmits<{ updateSelected: []; updateExpanded: [] }>();

const value = computed(() => {
  if (!props.col.field) return null;
  if (typeof props.col.field === 'string') return props.row[props.col.field];
  return props.col.field(props.row);
});

const selectRow = () => emit('updateSelected');
const expandRow = () => emit('updateExpanded');
</script>

<style lang="scss" scoped>
.vdt--expand-icon {
  $size: 1.5rem;
  height: $size;
  width: $size;
  border-radius: 50%;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  display: flex;
  align-items: center;
  margin: 0px auto;
  background-color: var(--vt-c-text-dark-2);
  &:hover {
    background-color: var(--vt-c-text-dark-1);
    transition: background-color 0.2s;
  }
}
.vdt--row-select {
  margin: 0px auto;
}
</style>
