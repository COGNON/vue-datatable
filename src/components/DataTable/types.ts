export interface VColumn {
  field?: string;
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

export type VSorterData = {
  field: string;
  dir: 'asc' | 'des';
  num: number;
};

export interface VSorter {
  [key: string]: VSorterData;
}

export type CellSeparators = 'row' | 'column' | 'cell' | 'none';
