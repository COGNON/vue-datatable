<template>
  <tr
    class="vdt--row"
    :class="(rowIndex % 2 ? 'vdt--row-even' : 'vdt--row-odd') + ' ' + selectedCls"
    :style="{ height: `${actualRowHeight}px` }"
  >
    <div class="vdt--row-inner" :style="{ height: `${rowHeight}px` }">
      <slot name="body-row" :row="row" :columns="columns" :row-index="rowIndex">
        <td v-if="selection !== 'none'" class="vdt--cell vdt--cell-extra">
          <slot name="body-selection" :row="row" :selected="selected" :select-row="selectRow">
            <q-checkbox :model-value="selected" dense @update:model-value="selectRow" />
          </slot>
        </td>

        <td v-if="$slots['expanded']" class="vdt--cell vdt--cell-extra">
          <slot name="expanded-icon" :row="row" :expanded="expanded" :expand-row="expandRow">
            <q-btn :icon="expandIcon" round size="xs" @click="expandRow" />
          </slot>
        </td>

        <body-cell v-for="(col, colIdx) in columns" :key="colIdx" :col-idx="colIdx" :col="col" :row="row">
          <!-- specific body cell slot takes precedence -->
          <template v-if="$slots[`body-cell-${col.name}`]" #body-cell="slotProps">
            <slot :name="`body-cell-${col.name}`" v-bind="slotProps" :row-index="rowIndex" />
          </template>
          <template v-else-if="$slots['body-cell']" #body-cell="slotProps">
            <slot name="body-cell" v-bind="slotProps" :row-index="rowIndex" />
          </template>
        </body-cell>
      </slot>
    </div>

    <div v-if="expanded && $slots['expanded']" ref="expandRef" class="vdt--row-expanded">
      <slot name="expanded" :row="row" />
    </div>
  </tr>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { VSelectionModes, VColumn } from '../types';
import BodyCell from './BodyCell.vue';
import useExpandRow from 'src/composables/useExpandRow';

const props = defineProps<{
  row: any;
  columns: VColumn[];
  rowIndex: number;
  rowHeight: number;
  selection: VSelectionModes;
  selected: boolean;
}>();

const emit = defineEmits<{
  (e: 'updateExpandedHeight', changeHeight: number): void;
  (e: 'updateSelected'): void;
}>();

const { expandRef, expandedHeight, expanded, expandIcon, expandRow } = useExpandRow();
watch(expandedHeight, (newH, oldH) => emit('updateExpandedHeight', expanded.value ? newH : -oldH));

const actualRowHeight = computed(() => props.rowHeight + expandedHeight.value);

const selectRow = () => emit('updateSelected');
const selectedCls = computed(() => (props.selected ? 'vdt--row-selected' : ''));
</script>
