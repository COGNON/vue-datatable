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

export type CellSeparators = 'row' | 'column' | 'cell' | 'none';
export type SelectionModes = 'single' | 'multiple' | 'none';
export type CellWrap = 'none' | 'wrap';

export type SelectedRow = {
  [key: number]: boolean;
};
