import { ref, computed } from 'vue';
import type { DataTableProps, VPagination } from 'src/components/types';

export default function usePagination(props: DataTableProps) {
  const pagination = defineModel<VPagination>('pagination', { default: { rowsPerPage: 0 } });

  return { pagination, currentPage };
}
