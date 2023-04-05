<template>
  <div class="q-pa-md q-gutter-y-lg">
    <!-- <div>
      <div class="text-h5">Query Fields</div>
      <div class="row q-gutter-x-md">
        <q-input :style="{ width: '100px' }" label="Label" :model-value="''" filled dense />
        <q-input :style="{ width: '120px' }" label="Label" :model-value="''" filled dense />
        <q-input :style="{ width: '100px' }" label="Label" :model-value="''" filled dense />
        <q-input :style="{ width: '130px' }" label="Label" :model-value="''" filled dense />
        <q-input :style="{ width: '180px' }" label="Label" :model-value="''" filled dense />
        <q-input label="Label" :model-value="''" filled dense />
        <q-input label="Label" :model-value="''" filled dense />
      </div>
    </div>

    <div class="row q-gutter-x-lg">
      <div class="column">
        <div class="text-h5">Query Fields</div>
        <div class="row q-gutter-x-md">
          <q-input :style="{ width: '150px' }" label="Label" :model-value="''" filled dense />
          <q-input :style="{ width: '150px' }" label="Label" :model-value="''" filled dense />
        </div>
      </div>

      <div class="column">
        <div class="text-h5">Query Fields</div>
        <div class="row q-gutter-x-md">
          <q-input :style="{ width: '120px' }" label="Label" :model-value="''" filled dense />
          <q-input :style="{ width: '120px' }" label="Label" :model-value="''" filled dense />
          <q-input :style="{ width: '100px' }" label="Label" :model-value="''" filled dense />
          <q-input label="Label" :style="{ width: '80px' }" :model-value="''" filled dense />
        </div>
      </div>
    </div>

    <div class="row q-gutter-x-md">
      <q-checkbox :model-value="false" label="Show Bad" dense />
      <q-checkbox :model-value="false" label="Show Unprocessed" dense />
    </div>

    <div>
      <div class="text-h5">Date Range</div>
      <div class="row q-gutter-x-md">
        <q-input label="Start" :model-value="''" filled dense :rules="[(val) => !!val || 'Error']" />
        <q-input label="End" :model-value="''" filled dense :rules="[(val) => !!val || 'Error']" />
      </div>
    </div>

    <div class="row q-gutter-x-md">
      <q-btn color="positive" label="Submit" />
      <q-btn color="negative" flat label="Reset" />
      <q-input :style="{ width: '200px' }" label="Label" :model-value="''" filled dense />
    </div> -->

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
      borders="cell"
      bordered
      selection="multiple"
      row-key="_id"
      :pagination="pagination"
    >
      <template #expanded>Test</template>
      <template #bottom>
        <q-select v-model="pagination.rowsPerPage" :options="[0, 20, 50, 100]" />
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTable from 'src/components/DataTable/DataTable.vue';
import { VColumn } from 'src/components/types';
import data from 'src/generated.json';

const loading = ref(false);
const pagination = ref({
  rowsPerPage: 20,
  initialPage: 5,
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
