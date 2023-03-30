<template>
  {{ endRowNum - pagination.rowsPerPage + 1 }} to {{ actualCurEnd }} of
  {{ totalRowCount }}
  <span :class="`${iconCls} mdi-chevron-double-left`" @click="$emit('updatePage', 0)" />
  <span :class="`${iconCls} mdi-chevron-left`" @click="$emit('updatePage', currentPage - 1)" />
  Page {{ currentPage + 1 }}
  <span :class="`${iconCls} mdi-chevron-right`" @click="$emit('updatePage', currentPage + 1)" />
  <span :class="`${iconCls} mdi-chevron-double-right`" @click="$emit('updatePage', totalPageNum - 1)" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VPagination } from '../types';

const props = defineProps<{
  currentPage: number;
  totalPageNum: number;
  totalRowCount: number;
  pagination: VPagination;
}>();

defineEmits<{ (e: 'updatePage', page: number): void }>();

const endRowNum = computed(() => props.pagination.rowsPerPage * (props.currentPage + 1));
const actualCurEnd = computed(() => (endRowNum.value > props.totalRowCount ? props.totalRowCount : endRowNum.value));

const iconCls = 'vdt--clickable mdi';
</script>
