<template>
  <div class="vdt-row--outer">
    <div
      :style="`height:${lineHeight}px`"
      :class="`vdt-row ${rowSeparatorCls} ${highlightClass} ${stripedClass}`"
    >
      <div
        v-if="$slots['expanded']"
        :style="`width:60px;height:${lineHeight}px`"
        :class="`vdt-cell ${colSeparatorCls}`"
      >
        <q-btn :icon="expandIcon" round @click="expanded = !expanded" />
      </div>
      <slot name="cells"></slot>
    </div>

    <div v-if="expanded && $slots['expanded']" class="vdt-row--expanded">
      <slot name="expanded" :row="row"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  row: any;
  lineHeight: number;
  rowSeparatorCls: string;
  colSeparatorCls: string;
  hightlightOnHover: boolean;
  stripedRows: boolean;
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
</style>
