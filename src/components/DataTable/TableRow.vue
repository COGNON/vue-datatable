<template>
  <tr
    class="vdt--row"
    :class="`${row.index % 2 ? 'vdt--row-even' : 'vdt--row-odd'} ${selectedCls}`"
  >
    <slot name="body-row" :row="row" :columns="columns" :row-index="row.index">
      <body-cell
        v-for="(col, colIdx) in columns"
        :key="colIdx"
        :col-idx="colIdx"
        :col="col"
        :row="row"
        :style="{ width: `${col.width}px`, textAlign: col.align }"
        :class="extraClasses.cell"
        :selected="selected"
        :expanded="expanded"
        @click="(e: MouseEvent) => $emit('onCellClick', e, col)"
        @dbl-click="(e: MouseEvent) => $emit('onCellDblClick', e,col)"
        @update-selected="$emit('updateSelected')"
        @update-expanded="$emit('updateExpanded', row)"
      >
        <!-- specific body cell slot takes precedence -->
        <template v-if="$slots[`body-cell-${col.colId}`]" #body-cell="slotProps">
          <slot :name="`body-cell-${col.colId}`" v-bind="slotProps" :row-index="row.index" />
        </template>
        <template v-else-if="$slots['body-cell']" #body-cell="slotProps">
          <slot name="body-cell" v-bind="slotProps" :row-index="row.index" />
        </template>
        <template v-else-if="$slots['expanded-icon']" #expanded-icon="slotProps">
          <slot name="expanded-icon" v-bind="slotProps" />
        </template>
      </body-cell>
    </slot>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VSelectionModes, VColumn, VExtraClasses, VRow } from '../types';
import BodyCell from './BodyCell.vue';

const props = defineProps<{
  row: VRow;
  columns: Required<VColumn>[];
  rowHeight: number;
  selection: VSelectionModes;
  selected: boolean;
  expanded: boolean;
  extraClasses: VExtraClasses;
  handleExpandIcon: boolean;
}>();

defineEmits<{
  updateExpandedHeight: [changeHeight: number];
  updateSelected: [];
  updateExpanded: [row: VRow];
  onCellClick: [event: MouseEvent, col: VColumn];
  onCellDblClick: [event: MouseEvent, col: VColumn];
}>();

const selectedCls = computed(() => (props.selected ? 'vdt--row-selected' : ''));
</script>
