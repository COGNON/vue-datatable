export type VColumn<T = unknown> = {
  name: string;
  field: string | ((row: T) => unknown);
  header: string;
  width?: number;
  resizable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
};

export type VRow<T = any> = Record<keyof T, any>;

export type VFilter = {
  [key: string]: string;
};

export type VSorter = {
  field: string;
  dir: 'asc' | 'desc';
};

export type VCellSeparators = 'row' | 'column' | 'cell' | 'none';
export type VSelectionModes = 'single' | 'multiple' | 'none';

export type VSelectedRow = {
  [key: string]: boolean;
};

export type VExpandedRow = {
  [key: number]: boolean;
};

export type VPagination = {
  rowsPerPage: number;
  initialPage?: number;
};

export type VExtraClasses = {
  table?: string;
  thead?: string;
  headerRow?: string;
  headerCell?: string;
  tbody?: string;
  row?: string;
  cell?: string;
};

export type VState = {
  columns: Pick<VColumn, 'width' | 'name'>[];
  sorters: VSorter[];
  filters: VFilter;
};
