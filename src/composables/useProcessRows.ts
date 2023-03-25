import { VFilter, VSorter } from 'src/components/DataTable/types';
import { computed, ref } from 'vue';
import { useSorter } from './useSorter';

export function useProcessRows(rows: any[], sorters: VSorter[], filters: VFilter) {
  const { sortRows } = useSorter();

  const processedRows = ref(sortRows(sorters, rows));

  return { processedRows };
}
