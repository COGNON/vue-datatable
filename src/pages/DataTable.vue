<template>
  <div class="q-pa-md">
    <DataTable
      :rows="rows"
      :columns="columns"
      filters
      filter-header
      multi-sort
      separators="row"
      :filter-component="QInput"
      :filter-component-props="{ dense: true, filled: true, label: 'Search' }"
    >
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from 'src/components/DataTable/DataTable.vue';
import { QInput } from 'quasar';

const rows = ref([]);
const columns = [
  {
    field: 'id',
    header: 'ID',
    width: 100,
  },
  {
    field: 'name',
    header: 'Name',
    width: 100,
  },
  {
    field: 'incantation',
    header: 'Incantation',
    width: 100,
  },
  {
    field: 'effect',
    header: 'Effect',
    width: 100,
  },
  {
    field: 'type',
    header: 'School',
    width: 100,
  },
  {
    field: 'light',
    header: 'Color',
    width: 100,
  },
];

onMounted(async () => {
  if (rows.value.length) return;

  const response = await fetch('https://wizard-world-api.herokuapp.com/Spells');
  rows.value = await response.json();
});
</script>
