<template>
  <input v-model="modelValue" type="checkbox" :class="modelValue ? 'vdt-checked' : ''" />
</template>

<script setup lang="ts">
const modelValue = defineModel();
</script>

<style lang="scss" scoped>
input[type='checkbox'] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #ccc;
  border-radius: 0.25rem;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  position: relative;
  background-color: #444;

  &::before {
    content: '\2714';
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    font-size: 0.9375rem;
    color: #fff;
    transition: transform 0.3s ease;
  }
  &.vdt-checked::before {
    transform: translate(-50%, -50%) scale(1);
  }
  &:focus {
    border-color: #00b0ff;
  }
  &:hover:not(.vdt-checked) {
    background-color: rgba(255, 255, 255, 0.1);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:active:not(.vdt-checked) {
    background-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
