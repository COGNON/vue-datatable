<template>
  <tr>
    <td :colspan="colNum">
      <slot name="expanded" :row="row" />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { VRow } from '../types';

const props = defineProps<{ row: VRow; expanded: boolean; colNum: number }>();
const emit = defineEmits<{ (e: 'updateExpandedHeight', changeHeight: number): void }>();

const expandRef = ref<HTMLElement | undefined>();
const expandedHeight = computed(() => expandRef.value?.clientHeight || 0);

// manage adjusting the grid height when the row is expanded
watch(expandedHeight, (newH, oldH) => emit('updateExpandedHeight', props.expanded ? newH : -oldH));

// emits event needed to adjust the grid height smaller when the row is collapased
onUnmounted(() => emit('updateExpandedHeight', -expandedHeight.value));
</script>
