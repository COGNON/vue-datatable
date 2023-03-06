<template>
  <div class="vdt-row--outer">
    <div
      :style="`height:${lineHeight}px`"
      :class="`vdt-row ${rowSeparatorCls} ${highlightClass} ${stripedClass}`"
    >
      <div
        v-if="selection !== 'none'"
        :class="`vdt-td vdt-td--selection ${colSeparatorCls}`"
      >
        <slot name="body-cell-selection">
          <q-checkbox
            :model-value="selected"
            @update:model-value="(val) => $emit('onSelect', val)"
          />
        </slot>
      </div>

      <div
        v-if="$slots['expanded']"
        :class="`vdt-td vdt-td--expand ${colSeparatorCls}`"
      >
        <q-btn :icon="expandIcon" round @click="expanded = !expanded" />
      </div>

      <body-cell
        v-for="col in columns"
        :key="col.field"
        :style="`width:${col.width}px;height:${lineHeight}px`"
        :class="`vdt-cell ${colSeparatorCls}`"
        :column="col"
        :row="row"
      >
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot v-if="$slots[name]" :name="name" v-bind="slotData" />
        </template>
      </body-cell>
    </div>

    <div v-if="expanded && $slots['expanded']" class="vdt-row--expanded">
      <slot name="expanded" :row="row" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { SelectionModes, VColumn } from './types';
import BodyCell from './BodyCell.vue';

const props = defineProps<{
  row: any;
  lineHeight: number;
  rowSeparatorCls: string;
  colSeparatorCls: string;
  hightlightOnHover: boolean;
  stripedRows: boolean;
  selection: SelectionModes;
  columns: VColumn[];
  selected: boolean;
}>();

defineEmits<{
  (e: 'onSelect', val: boolean): void;
}>();

const expanded = ref(false);
const expandIcon = computed(() => (expanded.value ? 'mdi-minus' : 'mdi-plus'));

const highlightClass = computed(() =>
  props.hightlightOnHover ? 'vdt-row--on-hover' : ''
);

const stripedClass = computed(() =>
  props.stripedRows ? 'vdt-row--striped' : ''
);
</script>

<style lang="scss" scoped>
.vdt-row {
  display: flex;
}
.vdt-row.vdt-row--striped {
  background-color: rgba(255, 255, 255, 0.05);
}
.vdt-row--expanded {
  padding-left: 60px;
}
.vdt-row.vdt-row--on-hover:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.vdt-td--selection {
  text-align: center;
  vertical-align: middle;
}
</style>
