<template>
  <tr>
    <slot name="expanded" :row="row" />
  </tr>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { VRow } from '../types'

const props = defineProps<{ row: VRow; expanded: boolean }>()
const emit = defineEmits<{ (e: 'updateExpandedHeight', changeHeight: number): void }>()

const expandRef = ref<HTMLElement | undefined>()
const expandedHeight = computed(() => expandRef.value?.clientHeight || 0)
watch(expandedHeight, (newH, oldH) => emit('updateExpandedHeight', props.expanded ? newH : -oldH))
</script>
