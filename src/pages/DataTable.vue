<template>
  <div class="q-pa-md">
    <DataTable
      :rows="rows"
      :columns="columns"
      filter-header
      separators="cell"
      reorderable-columns
      resizable-columns
      hightlight-on-hover
      striped-rows
      wrap-cells="wrap"
      :loading="loading"
      :height="500"
      :pagination="50"
    >
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTable from 'src/components/DataTable/DataTable.vue';
import { VColumn } from 'src/components/DataTable/types';
import data from 'src/generated.json';

const loading = ref(false);

const rows = ref(data);
const columns: VColumn[] = [
  {
    field: '_id',
    header: 'ID',
    width: 150,
  },
  {
    field: 'name',
    header: 'Name',
    width: 150,
  },
  {
    field: 'balance',
    header: 'Balance',
    width: 100,
  },
  {
    field: 'age',
    header: 'Age',
    width: 80,
  },
  {
    field: 'gender',
    header: 'Gender',
    width: 100,
  },
  {
    field: 'company',
    header: 'Company',
    width: 120,
  },
  {
    field: 'email',
    header: 'Email',
    width: 300,
  },
  {
    field: 'phone',
    header: 'Phone',
    width: 150,
  },
  {
    field: 'greeting',
    header: 'Greeting',
    width: 300,
  },
  {
    field: 'registered',
    header: 'Registered',
    width: 200,
  },
];
</script>
