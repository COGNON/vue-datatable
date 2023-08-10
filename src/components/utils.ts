import type { VColumn, VSorter } from './types';

export function findSorterIndex(sorters: VSorter[], field: string): number {
  return sorters.findIndex((sorter) => sorter.field === field);
}

export function getColIdx(columns: VColumn[], colId: string): number {
  return columns.findIndex((col) => col.colId === colId);
}
