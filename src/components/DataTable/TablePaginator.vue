<template>
  <div class="vdt--paginator">
    Rows Per Page:
    <select
      v-if="pagination.pageOptions"
      v-model.number="pagination.rowsPerPage"
      class="vdt--rpp-select"
    >
      <option v-for="n in pagination.pageOptions" :key="n">{{ n }}</option>
    </select>

    <template v-if="pagination.rowsPerPage">
      {{ endRowNum - pagination.rowsPerPage + 1 }} to {{ actualCurEnd }} of
      {{ totalRowCount }}
      <svg-icon
        :class="currentPage === 0 ? disabledCls : iconCls"
        type="mdi"
        :path="mdiChevronDoubleLeft"
        @click="currentPage === 0 ? null : $emit('updatePage', 0)"
      />
      <svg-icon
        :class="currentPage === 0 ? disabledCls : iconCls"
        type="mdi"
        :path="mdiChevronLeft"
        @click="currentPage === 0 ? null : $emit('updatePage', currentPage - 1)"
      />
      Page {{ currentPage + 1 }} of {{ totalPageNum + 1 }}
      <svg-icon
        :class="currentPage === totalPageNum ? disabledCls : iconCls"
        type="mdi"
        :path="mdiChevronRight"
        @click="currentPage === totalPageNum ? null : $emit('updatePage', currentPage + 1)"
      />
      <svg-icon
        :class="currentPage === totalPageNum ? disabledCls : iconCls"
        type="mdi"
        :path="mdiChevronDoubleRight"
        @click="currentPage === totalPageNum ? null : $emit('updatePage', totalPageNum)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VPagination } from '../types';
import SvgIcon from '@jamescoyle/vue-icon';
import {
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiChevronLeft,
  mdiChevronRight
} from '@mdi/js';

const props = defineProps<{
  currentPage: number;
  totalPageNum: number;
  totalRowCount: number;
}>();

defineEmits<{ (e: 'updatePage', page: number): void }>();

const pagination = defineModel<VPagination>('pagination');

const endRowNum = computed(() => pagination.value.rowsPerPage * (props.currentPage + 1));
const actualCurEnd = computed(() =>
  endRowNum.value > props.totalRowCount ? props.totalRowCount : endRowNum.value
);

const iconCls = 'vdt--clickable';
const disabledCls = 'vdt--no-page';
</script>

<style scoped>
.vdt--paginator {
  display: flex;
  align-items: center;
}
.vdt--rpp-select {
  padding: 0px 5px;
  margin: 0px 5px;
}
.vdt--no-page {
  color: rgba(235, 235, 235, 0.2);
}
</style>
