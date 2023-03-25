<template>
  <div class="q-pa-md">
    <DataTable
      :rows="rows"
      :columns="columns1"
      filter-header
      separators="cell"
      reorderable-columns
      resizable-columns
      wrap-cells="wrap"
      :loading="loading"
      :height="500"
      borders="both"
      bordered
    >
      <template #body-expanded="{ row }">{{ row }}</template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTable from 'src/components/dataTable2/DataTable.vue';
import { VColumn } from 'src/components/DataTable/types';
import data from 'src/generated.json';

const loading = ref(false);

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
