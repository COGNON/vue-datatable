<template>
  <DataTable
    v-model:pagination="pagination"
    v-model:selected="selected"
    :rows="rows"
    :columns="columns1"
    filter-header
    reorderable-columns
    resizable-columns
    striped-rows
    wrap-cells="wrap"
    :loading="loading"
    :height="600"
    borders="cell"
    bordered
    selection="multiple"
    row-key="_id"
    title="test"
    state-key="test-table"
  >
    <template #expanded>Test</template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTable from '../components/DataTable.vue';
import type { VColumn } from '../components/types';
import data from '../generated.json';

const selected = ref([]);

const loading = ref(false);
const pagination = ref({
  rowsPerPage: 0,
  // initialPage: ,
  pageOptions: [0, 20, 50, 100]
});

const rows = ref(data);
const columns1: VColumn[] = [
  {
    colId: 'select',
    width: 50,
    checkboxColumn: true
  },
  {
    colId: 'expand',
    width: 50,
    expandColumn: true
  },
  {
    field: '_id',
    header: 'ID',
    width: 150,
    filterable: false
  },
  {
    field: 'name',
    header: 'Name',
    width: 150,
    resizable: false
  },
  {
    field: 'balance',
    header: 'Balance',
    width: 100
  },
  {
    field: 'age',
    header: 'Age',
    width: 150,
    align: 'center',
    sort: 'asc'
  },
  {
    field: 'gender',
    header: 'Gender',
    width: 100,
    filter: 'female'
  },
  {
    field: 'company',
    header: 'Company',
    width: 120
  },
  {
    field: 'email',
    header: 'Email',
    width: 300
  },
  {
    field: 'phone',
    header: 'Phone',
    width: 150
  },
  {
    field: 'greeting',
    header: 'Greeting',
    width: 400
  },
  {
    field: 'registered',
    header: 'Registered',
    width: 200
  }
];
</script>
