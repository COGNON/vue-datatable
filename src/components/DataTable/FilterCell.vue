<template>
  <div class="vdt--th-filter" aria-description="Type to filter column">
    <q-input v-model="filter" filled dense @update:model-value="(val) => $emit('update:modelValue', val)" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { VColumn } from '../types';

const props = defineProps<{ col: VColumn; filter: any }>();
const filter = ref();
watch(
  () => props.filter,
  (newVal) => (filter.value = newVal)
);

defineEmits<{ (e: 'update:modelValue', val: any): void }>();
</script>
