<template>
  <tr
    class="vdt--row"
    :class="`${row.index % 2 ? 'vdt--row-even' : 'vdt--row-odd'} ${selectedCls}`"
  >
    <slot name="body-row" :row="row" :columns="columns" :row-index="row.index">
      <td v-if="selection !== 'none'" class="vdt--cell vdt--cell-extra">
        <slot name="body-selection" :row="row" :selected="selected" :select-row="selectRow">
          <vdt-checkbox :model-value="selected" dense @update:model-value="selectRow" />
        </slot>
      </td>

      <td v-if="$slots['expanded']" class="vdt--cell vdt--cell-extra">
        <slot name="expanded-icon" :row="row" :expanded="expanded" :expand-row="expandRow">
          <!-- <q-btn v-if="!handleExpandIcon" :icon="expandIcon" round size="xs" @click="expandRow" /> -->
        </slot>
      </td>

      <body-cell
        v-for="(col, colIdx) in columns"
        :key="colIdx"
        :col-idx="colIdx"
        :col="col"
        :row="row"
        :style="{ width: `${col.width}px`, textAlign: col.align }"
        :class="extraClasses.cell"
        @on-cell-click="(e) => $emit('onCellClick', e, col)"
        @on-cell-dbl-click="(e) => $emit('onCellDblClick', e, col)"
      >
        <!-- specific body cell slot takes precedence -->
        <template v-if="$slots[`body-cell-${col.name}`]" #body-cell="slotProps">
          <slot :name="`body-cell-${col.name}`" v-bind="slotProps" :row-index="row.index" />
        </template>
        <template v-else-if="$slots['body-cell']" #body-cell="slotProps">
          <slot name="body-cell" v-bind="slotProps" :row-index="row.index" />
        </template>
      </body-cell>
    </slot>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VSelectionModes, VColumn, VExtraClasses, VRow } from '../types';
import BodyCell from './BodyCell.vue';
import VdtCheckbox from './VdtCheckbox.vue';

const props = defineProps<{
  row: VRow;
  columns: VColumn[];
  rowHeight: number;
  selection: VSelectionModes;
  selected: boolean;
  expanded: boolean;
  extraClasses: VExtraClasses;
  handleExpandIcon: boolean;
}>();

const emit = defineEmits<{
  (e: 'updateExpandedHeight', changeHeight: number): void;
  (e: 'updateSelected'): void;
  (e: 'updateExpanded', index: number): void;
  (e: 'onCellClick', event: MouseEvent, col: VColumn): void;
  (e: 'onCellDblClick', event: MouseEvent, col: VColumn): void;
}>();

const expandRow = () => emit('updateExpanded', props.row.index);
const expandIcon = computed(() => (props.expanded ? 'mdi-minus' : 'mdi-plus'));

const selectRow = () => emit('updateSelected');
const selectedCls = computed(() => (props.selected ? 'vdt--row-selected' : ''));
</script>
