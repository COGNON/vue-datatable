import { VSorter } from './DataTable/types';

export function findSorterIndex(sorters: VSorter[], field: string): number {
  return sorters.findIndex((sorter) => sorter.field === field);
}
