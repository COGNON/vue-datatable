<template>
  <div class="vdt-row--outer">
    <div :style="`height:${rowHeight}px`" :class="`vdt-row ${rowSeparatorCls}`">
      <div
        v-if="$slots['expanded']"
        :style="`width:60px;height:${rowHeight}px`"
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

defineProps<{
  row: any;
  rowHeight: number;
  rowSeparatorCls: string;
  colSeparatorCls: string;
}>();

const expanded = ref(false);
const expandIcon = computed(() => (expanded.value ? 'mdi-minus' : 'mdi-plus'));
</script>

<style lang="scss" scoped>
.vdt-row {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
}
.vdt-row--expanded {
  padding-left: 60px;
}
</style>
