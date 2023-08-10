import { ref, watch } from 'vue';
import type { DataTableProps, VFilter, VRow } from 'src/components/types';

export default function useFilter(props: DataTableProps) {
  const filters = ref<VFilter>(props.defaultFilters);
  watch(
    () => props.defaultFilters,
    (newFilters) => (filters.value = newFilters)
  );

  function updateFilter(field: string, val: unknown) {
    if (val) filters.value[field] = String(val);
    else delete filters.value[field];
  }

  const globalFilterValue = ref('');

  const handleFilterRows = (filters: VFilter, rows: VRow[]) => {
    // no filters, return original rows
    if (!Object.keys(filters).length) return rows;

    return rows.filter((row) => {
      return Object.keys(filters).every((field) => {
        if (!filters[field]) {
          delete filters[field];
          return true;
        }
        return row[field]
          ? String(row[field]).toLowerCase().includes(filters[field].toLowerCase())
          : false;
      });
    });
  };

  const handleGlobalFilter = (filter: string, rows: VRow[]) => {
    return rows.filter((row) => {
      return Object.values(row).some((value) => {
        return String(value).toLowerCase().includes(filter.toLowerCase());
      });
    });
  };

  return { handleFilterRows, handleGlobalFilter, updateFilter, filters, globalFilterValue };
}
