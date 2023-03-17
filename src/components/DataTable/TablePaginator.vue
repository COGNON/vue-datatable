<template>
  {{ endRowNum - rowsPerPage + 1 }} to {{ actualCurEnd }} of
  {{ totalRowCount }}
  <span
    class="clickable mdi mdi-chevron-double-left"
    @click="$emit('updatePage', 0)"
  />
  <span
    class="clickable mdi mdi-chevron-left"
    @click="$emit('updatePage', currentPage - 1)"
  />
  Page {{ currentPage }}
  <span
    class="clickable mdi mdi-chevron-right"
    @click="$emit('updatePage', currentPage + 1)"
  />
  <span
    class="clickable mdi mdi-chevron-double-right"
    @click="$emit('updatePage', totalPageNum - 1)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalPageNum: number;
  rowsPerPage: number;
  totalRowCount: number;
}>();

defineEmits<{ (e: 'updatePage', page: number): void }>();

const endRowNum = computed(() => props.rowsPerPage * (props.currentPage + 1));
const actualCurEnd = computed(() =>
  endRowNum.value > props.totalRowCount ? props.totalRowCount : endRowNum.value
);
</script>
