import type { VSelectedRow } from '../components/types';
import { ref } from 'vue';

export default function useExpandedRows() {
  const expandedRows = ref<VSelectedRow>({});
  function updateExpanded(idx: number) {
    if (expandedRows.value[idx]) delete expandedRows.value[idx];
    else expandedRows.value[idx] = true;
  }

  const expandedRowHeight = ref<number[]>([]);

  return { expandedRows, expandedRowHeight, updateExpanded };
}
