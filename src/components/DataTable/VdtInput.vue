<template>
  <div class="text-input">
    <label v-if="label" for="input">{{ label }}</label>
    <input v-model="modelValue" type="text" name="input" aria-label="Filter" />
    <button
      v-show="!!modelValue"
      class="clear-button"
      aria-label="Clear field"
      @click="modelValue = ''"
    >
      <svg-icon type="mdi" :path="mdiClose" class="material-icons" size="20" />
    </button>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiClose } from '@mdi/js';

const modelValue = defineModel({ default: '' });

defineProps<{ label?: string }>();
</script>

<style lang="scss" scoped>
.text-input {
  display: flex;
  position: relative;
  align-items: center;

  label {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    transition: all 0.2s ease-out;
    transform-origin: top left;
    pointer-events: none;
  }
  input {
    width: 100%;
    background-color: #222;
    border: none;
    color: #fff;
    font-size: 16px;
    outline: 1px solid #ffffff80;
    padding: 2px;
    border-radius: 5px;
    transition: all 0.2s ease-out;
    &:focus {
      border-color: #00897b;
    }
    &:focus + label,
    &:not(:placeholder-shown) + label {
      font-size: 12px;
      color: #00897b;
      transform: translateY(-24px) scale(0.75);
    }
    .clear-button {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: none;
      cursor: pointer;
      &:hover {
        color: #ff5252;
      }
    }
    .material-icons {
      color: #fff;
    }
  }
}
</style>
