import { VSorter } from 'src/components/DataTable/types';

export function useSorter() {
  const sortRows = (sorters: VSorter[], rows: any[]): any[] => {
    if (!sorters.length) return rows;

    // sort by num in order, then convert fields into an array
    // descending fields are prepended with a '-'
    const fields = sorters.map((sorter) => (sorter.dir === 'desc' ? `-${sorter.field}` : sorter.field));

    return rows.sort(multiSort(fields));
  };

  const multiSort = (fields: string[]) => {
    const dir: number[] = [];
    const len = fields.length;

    fields = fields.map((o, i) => {
      if (o[0] === '-') {
        dir[i] = -1;
        o = o.substring(1);
      } else {
        dir[i] = 1;
      }
      return o;
    });

    return (a: any, b: any): number => {
      for (let i = 0; i < len; i++) {
        const o = fields[i];
        if (a[o] > b[o]) return dir[i];
        if (a[o] < b[o]) return -dir[i];
      }
      return 0;
    };
  };

  return { sortRows };
}
