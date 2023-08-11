import { ref } from 'vue';
import type { DataTableProps, VRow, VSelectedRow } from '../components/types';

export default function useExpandedRows(props: DataTableProps) {
  const expandedRows = ref<VSelectedRow>({});
  function updateExpanded(row: VRow) {
    if (!props.rowKey) return;

    const keyVal = row[props.rowKey];
    if (expandedRows.value[keyVal]) delete expandedRows.value[keyVal];
    else expandedRows.value[keyVal] = true;
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
