<template>
  <div class="q-pa-md q-gutter-y-lg">
    <DataTable
      v-model:pagination="pagination"
      v-model:selected="selected"
      :rows="rows"
      :columns="columns1"
      filter-header
      separators="cell"
      reorderable-columns
      resizable-columns
      striped-rows
      wrap-cells="wrap"
      :loading="loading"
      :height="800"
      borders="cell"
      bordered
      selection="multiple"
      row-key="_id"
      title="test"
      state-key="test-table"
    >
      <template #expanded>Test</template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTable from 'src/components/DataTable/DataTable.vue';
import { VColumn } from 'src/components/types';
import data from 'src/generated.json';

const selected = ref([]);

const loading = ref(false);
const pagination = ref({
  rowsPerPage: 20,
  initialPage: 5,
  pageOptions: [0, 20, 50, 100],
});

const rows = ref(data);
const columns1: VColumn[] = [
  {
    name: 'id',
    field: '_id',
    header: 'ID',
    width: 150,
  },
  {
    name: 'name',
    field: 'name',
    header: 'Name',
    width: 150,
  },
  {
    name: 'balance',
    field: 'balance',
    header: 'Balance',
    width: 100,
  },
  {
    name: 'age',
    field: 'age',
    header: 'Age',
    width: 150,
    align: 'center',
  },
  {
    name: 'gender',
    field: 'gender',
    header: 'Gender',
    width: 100,
  },
  {
    name: 'company',
    field: 'company',
    header: 'Company',
    width: 120,
  },
  {
    name: 'email',
    field: 'email',
    header: 'Email',
    width: 300,
  },
  {
    name: 'phone',
    field: 'phone',
    header: 'Phone',
    width: 150,
  },
  {
    name: 'greeting',
    field: 'greeting',
    header: 'Greeting',
    width: 400,
  },
  {
    name: 'registered',
    field: 'registered',
    header: 'Registered',
    width: 200,
  },
];
</script>
