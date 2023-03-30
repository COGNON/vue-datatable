import { ref } from 'vue';

export default function usePagination(props: any) {
  // subtract 1 because the pages are 0-based
  const currentPage = ref(props.pagination.initialPage - 1 || 0);
  const totalRowCount = ref(0);

  function pageRows(rows: any[]) {
    if (props.pagination.rowsPerPage === 0) return rows;
    totalRowCount.value = 0;
    const pagedRows: any[] = [];
    for (let i = 0; i < rows.length; i += props.pagination.rowsPerPage) {
      const sliced = rows.slice(i, i + props.pagination.rowsPerPage);
      totalRowCount.value += sliced.length;
      pagedRows.push(sliced);
    }
    return pagedRows;
  }

  return { currentPage, totalRowCount, pageRows };
}
