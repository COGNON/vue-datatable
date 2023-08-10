export type DataTableProps<T = Record<string, string>> = {
  rowKey?: keyof T;
  columns: VColumn[];
  rows: VRow[];
  height?: number;
  rowHeight?: number;
  virtualScrollNodePadding?: number;
  borders?: VCellSeparators;
  bordered?: boolean;
  resizableColumns?: boolean;
  reorderableColumns?: boolean;
  highlightOnHover?: boolean;
  stripedRows?: boolean;
  globalFilter?: boolean;
  defaultFilters?: VFilter;
  defaultSorters?: VSorter[];
  loading?: boolean;
  loadingText?: string;
  title?: string;
  noDataText?: string;
  selection?: VSelectionModes;
  hideTableBottom?: boolean;
  extraClasses?: VExtraClasses;
  stateKey?: string;
  columnDefaults?: Partial<VColumn>;
  handleExpandIcon?: boolean;
  allowSelectAll?: boolean;
  selected: VRow[];
};

export type VColumn<T = Record<string, string>> = {
  colId?: string;
  field?: keyof T | ((row: T) => unknown);
  header?: string;
  align?: 'left' | 'right' | 'center';
  width?: number;
  resizable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  sort?: SortDir;
  filter?: string;
  checkboxColumn?: boolean;
};

export type VRow<T = Record<string, any>> = {
  [key in keyof T]: any;
} & {
  index: number;
};

export type VFilter = {
  [key: string]: string;
};

export type VSorter = {
  field: string;
  dir: SortDir;
};

export type VCellSeparators = 'row' | 'column' | 'cell' | 'none';
export type VSelectionModes = 'single' | 'multiple' | 'none';
export type SortDir = 'asc' | 'desc';

export type VSelectedRow = {
  [key: string]: boolean;
};

export type VExpandedRow = {
  [key: number]: boolean;
};

export type VPagination = {
  rowsPerPage: number;
  initialPage?: number;
  pageOptions?: number[];
};

export type VExtraClasses = {
  table: string;
  thead: string;
  headerRow: string;
  headerCell: string;
  tbody: string;
  row: string;
  cell: string;
};

export type VState = {
  columns: Pick<VColumn, 'width' | 'colId'>[];
  sorters: VSorter[];
  filters: VFilter;
};

export type VirtualScrollerProps = {
  rows: VRow[];
  columns: VColumn[];
  rowHeight: number;
  virtualScrollNodePadding: number;
  rootHeight: number;
  colWidths: number;
  scrollLeft: number;
  stripedRows: boolean;
  expandedRowHeight: number;
  rowsPerPage: number;
  currentPage: number;
};
