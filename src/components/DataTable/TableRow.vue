<template>
  <tr
    class="vdt--row"
    :class="`${rowIndex % 2 ? 'vdt--row-even' : 'vdt--row-odd'} ${selectedCls}`"
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

        <body-cell
          v-for="(col, colIdx) in columns"
          :key="colIdx"
          :col-idx="colIdx"
          :col="col"
          :row="row"
          :class="extraClasses.cell"
          @on-cell-click="(e) => $emit('onCellClick', e, col)"
          @on-cell-dbl-click="(e) => $emit('onCellDblClick', e, col)"
        >
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
import { computed, ref, watch } from 'vue';
import { VSelectionModes, VColumn, VExtraClasses, VRow } from '../types';
import BodyCell from './BodyCell.vue';

const props = defineProps<{
  row: VRow;
  columns: VColumn[];
  rowIndex: number;
  rowHeight: number;
  selection: VSelectionModes;
  selected: boolean;
  expanded: boolean;
  extraClasses: VExtraClasses;
}>();

const emit = defineEmits<{
  (e: 'updateExpandedHeight', changeHeight: number): void;
  (e: 'updateSelected'): void;
  (e: 'updateExpanded', index: number): void;
  (e: 'onCellClick', event: MouseEvent, col: VColumn): void;
  (e: 'onCellDblClick', event: MouseEvent, col: VColumn): void;
}>();

const expandRow = () => emit('updateExpanded', props.rowIndex);
const expandRef = ref<HTMLElement | undefined>();
const expandIcon = computed(() => (props.expanded ? 'mdi-minus' : 'mdi-plus'));

const expandedHeight = computed(() => expandRef.value?.clientHeight || 0);
watch(expandedHeight, (newH, oldH) => emit('updateExpandedHeight', props.expanded ? newH : -oldH));

const actualRowHeight = computed(() => props.rowHeight + expandedHeight.value);

const selectRow = () => emit('updateSelected');
const selectedCls = computed(() => (props.selected ? 'vdt--row-selected' : ''));
</script>
