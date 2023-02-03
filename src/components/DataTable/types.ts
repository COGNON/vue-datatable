export interface VColumn {
  field?: string;
  header: string;
  width?: number;
}

export interface VGridProps {
  rows: any[];
  columns: VColumn[];
}

export interface VFilters {
  [key: string]: string;
}

export type CellSeparators = 'row' | 'column' | 'cell' | 'none';
