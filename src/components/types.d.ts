export interface VColumn<T = unknown> {
  name: string;
  field: string | ((row: T) => unknown);
  header: string;
  width?: number;
  resizable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export interface VGridProps {
  rows: any[];
  columns: VColumn[];
}

export type VFilter = {
  [key: string]: string;
};

export type VSorter = {
  field: string;
  dir: 'asc' | 'desc';
};

export type VCellSeparators = 'row' | 'column' | 'cell' | 'none';
export type VSelectionModes = 'single' | 'multiple' | 'none';
export type VCellWrap = 'none' | 'wrap';

export type VSelectedRow = {
  [key: string]: boolean;
};

export type VPagination = {
  rowsPerPage: number;
  initialPage?: number;
};
