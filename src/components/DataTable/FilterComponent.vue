<template>
  <label v-if="label" for="global-filter">{{ label }}</label>
  <input
    type="text"
    name="global-filter"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  label: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>
