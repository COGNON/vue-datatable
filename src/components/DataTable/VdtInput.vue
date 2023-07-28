<template>
  <div class="text-input">
    <label for="input">Test</label>
    <input type="text" :value="modelValue" name="input" @input="$emit('update:modelValue', $event.target?.value)" />
    <button v-show="!!modelValue" class="clear-button" aria-label="Clear field" @click="$emit('update:modelValue', '')">
      <svg-icon type="mdi" :path="mdiClose" class="material-icons" size="20" />
    </button>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiClose } from '@mdi/js';

defineProps<{
  modelValue: string | number | null;
  label?: string;
}>();
defineEmits<{ (e: 'update:modelValue', val: boolean): void }>();
</script>

<style scoped>
/* Text Input styles */
.text-input {
  display: flex;
  position: relative;
  align-items: center;
}

/* Label styles */
.text-input label {
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

/* Input styles */
.text-input input {
  background-color: #222;
  border: none;
  color: #fff;
  font-size: 16px;
  outline: 1px solid #ffffff80;
  padding: 2px;
  border-radius: 5px;
  transition: all 0.2s ease-out;
}

/* Input focus styles */
.text-input input:focus {
  border-color: #00897b;
}

/* Input focus label styles */
.text-input input:focus + label,
.text-input input:not(:placeholder-shown) + label {
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
}

.clear-button:hover {
  color: #ff5252;
}

.material-icons {
  color: #fff;
}
</style>
