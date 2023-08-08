import type { VSelectedRow } from '../components/types';
import { ref } from 'vue';

export default function useExpandedRows() {
  const expandedRows = ref<VSelectedRow>({});
  function updateExpanded(idx: number) {
    if (expandedRows.value[idx]) delete expandedRows.value[idx];
    else expandedRows.value[idx] = true;
  }

  const expandedRowHeight = ref<number[]>([]);
  function handleExpandedRowHeight(height: number, currentPage = 0) {
    if (!expandedRowHeight.value[currentPage]) {
      expandedRowHeight.value[currentPage] = Math.max(height, 0);
    } else {
      expandedRowHeight.value[currentPage] += height;
    }
  }

  return { expandedRows, expandedRowHeight, handleExpandedRowHeight, updateExpanded };
}
